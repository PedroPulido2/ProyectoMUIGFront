import React, { useEffect, useState } from "react";
import { FaEdit, FaLock, FaTrash } from "react-icons/fa";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import imagenProfileFemale from '../styles/images/profile-female.jpg';
import imagenProfileMale from '../styles/images/profile-male.jpg';
import imagenProfileOther from '../styles/images/profile-other.jpg';
import { showNotification, showConfirmation } from "../utils/showNotification";

import PerfilModalForm from '../components/modalForms/PerfilModalForm';
import PerfilModalChPassword from "../components/modalForms/PerfilModalChPassword";
import '../styles/Perfil.css'

const Perfil = ({ setAuth }) => {
    const username = localStorage.getItem("username") || "Invitado";
    const id_Perfil = localStorage.getItem("id_Perfil") || null;
    const token = localStorage.getItem("token") || null;

    const [perfil, setPerfil] = useState({});
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [urlFoto, setUrlFoto] = useState(localStorage.getItem('urlFotoProfile') || "");

    useEffect(() => {
        document.title = "Datos del Perfil";
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("id_Perfil");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("urlFotoProfile")
        setAuth(false);
    };

    const fetchData = async () => {
        try {
            const response = await api.get(`/perfil/${id_Perfil}`);

            if (response.data.length > 0) {
                const perfilData = response.data[0];
                setPerfil(perfilData);

                // Guardar en localStorage y actualizar estado
                localStorage.setItem("urlFotoProfile", perfilData.foto);
                setUrlFoto(perfilData.foto);
            } else {
                setPerfil({ foto: "" })
            }
        } catch (err) {
            setPerfil({ foto: "" });
            setUrlFoto("");
            showNotification("error", "Error al obtener los datos", err.response?.data?.error || "Ocurrio un error inesperado. Intente nuevamente.");
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return; // Si no se selecciona un archivo, salir de la función.

        // Verificar si el archivo es una imagen
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validImageTypes.includes(file.type)) {
            return showNotification("warning", "Formato no válido", "Por favor, selecciona una imagen en formato JPG o PNG.");
        }

        const formData = new FormData();
        formData.append("id_Perfil", perfil.id_Perfil);

        Object.keys(perfil).forEach(key => {
            if (key !== "foto" && key !== "id_Perfil") {
                let value = perfil[key];

                // Limpiar la fecha si es fechaNacimiento
                if (key === "fechaNacimiento" && typeof value === "string") {
                    value = value.split("T")[0];
                }

                formData.append(key, value);
            }
        });

        formData.append("foto", file); // Agrega la imagen
        formData.append("idPerfilAccion", id_Perfil);
        formData.append("usernameAccion", username);

        try {
            const response = await api.put(`/perfil/${perfil.id_Perfil}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                await fetchData();
                showNotification("success", "¡Éxito!", "Foto de perfil actualizada con éxito.");
            }
        } catch (error) {
            console.error("Error al actualizar la foto del perfil:", error);
            showNotification("error", "Error", error.response?.data?.error || "Hubo un error al actualizar la foto.");
        }
    };

    const handleSave = async (updatedData) => {
        try {
            const cleanedData = {
                ...updatedData,
                fechaNacimiento: updatedData.fechaNacimiento?.split("T")[0],
                idPerfilAccion: id_Perfil,
                usernameAccion: username
            };

            const response = await api.put(`/perfil/${perfil.id_Perfil}`, cleanedData);

            if (response.status === 200) {
                showNotification("success", "¡Éxito!", "Datos del perfil actualizados con éxito.");
                setIsFormModalOpen(false);
                await fetchData();
            } else {
                throw new Error("La actualización no fue exitosa.");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            showNotification("error", "Error", error.response?.data?.error || "Hubo un error al actualizar el perfil.");
        }
    };

    const handleSavePassword = async (newPassword) => {
        if (!newPassword || newPassword.length < 6) {
            showNotification("error", "Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        try {
            const response = await api.put(`/login/cPw/${username}`,
                { password: newPassword, idPerfilAccion: id_Perfil, usernameAccion: username },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showNotification("success", "¡Éxito!", response.data.message);
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            showNotification("error", "Error", error.response?.data?.error || "Error al actualizar la contraseña, por favor vuelva a iniciar sesión.");
        }
    };

    //Petición para eliminar el perfil
    const handleDeleteProfile = async () => {
        const confirmDelete = await showConfirmation("¿Está seguro?", "Esta acción eliminará su perfil permanentemente y no se puede deshacer.");

        if (confirmDelete.isConfirmed) {
            try {
                await api.delete(`/perfil/${perfil.id_Perfil}`, {
                    data: {
                        idPerfilAccion: id_Perfil,
                        usernameAccion: username,
                    }
                });
                showNotification("success", "¡Perfil Eliminado!", `El perfil con ID ${perfil.id_Perfil} ha sido eliminado correctamente.`);
                handleLogout(); // Cierra sesión después de eliminar el perfil
            } catch (error) {
                console.error("Error al eliminar el perfil:", error);
                showNotification("error", "Error", error.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
            }
        }
    };

    return (
        <PageLayout username={username} setAuth={setAuth} urlimgProfile={urlFoto}>
            <div className="main">
                <h2>Configuración del Perfil</h2>
                <br />
                <div className="infPerfil">
                    <div className="imagen-container">
                        <img src={perfil.foto ? `${process.env.VITE_URL_BACK}/imagen/load/${perfil.foto.split('/d/')[1]?.split('/')[0] || null}` : perfil.genero === "Masculino" ? imagenProfileMale : perfil.genero === "Femenino" ? imagenProfileFemale : imagenProfileOther}
                            alt="Perfil"
                            className="editable-img"
                        />
                        <input type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input-file" />
                    </div>
                    <div className="info-container">
                        <h3>Información personal</h3>
                        <br />
                        {perfil && perfil.id_Perfil ? (
                            <>
                                <p><strong>Id:</strong> {perfil.id_Perfil}</p>
                                <p><strong>Tipo de Identificación:</strong> {perfil.tipoIdentificacion}</p>
                                <p><strong>Nombre:</strong> {perfil.nombre}</p>
                                <p><strong>Apellido:</strong> {perfil.apellido}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {perfil.fechaNacimiento ? new Date(perfil.fechaNacimiento.split("T")[0] + "T00:00:00").toLocaleDateString() : "No disponible"}</p>
                                <p><strong>Género:</strong> {perfil.genero}</p>
                                <p><strong>Correo:</strong> {perfil.correo}</p>
                                <p><strong>Teléfono:</strong> {perfil.telefono}</p>
                                <p><strong>Fecha de Creación:</strong> {perfil.fechaCreacion ? new Date(perfil.fechaCreacion).toLocaleDateString() : "No disponible"}</p>
                                {perfil.isAdmin === 3 ? (
                                    <p><strong>Es SuperAdministrador</strong></p>
                                ) : perfil.isAdmin === 2 ? (
                                    <p><strong>Es Administrador</strong></p>
                                ) : (
                                    <p><strong>Es Visitante</strong></p>
                                )}
                            </>
                        ) : (
                            <p>Cargando Información...</p>
                        )}
                    </div>
                    <div className="button-container">
                        <button className="edit-button" onClick={() => setIsFormModalOpen(true)}>
                            <FaEdit /> Editar
                        </button>
                        <button className="btn-change-password" onClick={() => setIsPasswordModalOpen(true)}>
                            <FaLock /> Cambiar Contraseña
                        </button>
                        <button className="btn-delete-account" onClick={handleDeleteProfile}>
                            <FaTrash /> Eliminar Cuenta
                        </button>
                    </div>
                </div>
            </div>
            <PerfilModalForm isOpen={isFormModalOpen} closeModal={() => setIsFormModalOpen(false)} onSave={handleSave} perfilData={perfil} />
            <PerfilModalChPassword isOpen={isPasswordModalOpen} closeModal={() => setIsPasswordModalOpen(false)} onSave={handleSavePassword} />
        </PageLayout>
    );
}

export default Perfil;
