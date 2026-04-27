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
import style from '../styles/Perfil.module.css';

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
            <div className={style.profileHeader}>
                <h2>Configuración del Perfil</h2>
            </div>

            <div className={style.infPerfil}>
                <div className={style.imagenContainer}>
                    <img
                        src={perfil.foto ? `${process.env.VITE_URL_BACK}/imagen/load/${perfil.foto.split('/d/')[1]?.split('/')[0] || null}` : perfil.genero === "Masculino" ? imagenProfileMale : perfil.genero === "Femenino" ? imagenProfileFemale : imagenProfileOther}
                        alt="Perfil"
                        className={style.editableImg}
                    />
                    <div className={style.imageOverlay}>Cambiar Foto</div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={style.inputFile}
                    />
                </div>

                <div className={style.infoContainer}>
                    <h3>Información Personal</h3>

                    {perfil && perfil.id_Perfil ? (
                        <div className={style.dataGrid}>
                            <div className={style.dataItem}>
                                <span>Id</span>
                                <p>{perfil.id_Perfil}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Tipo de Identificación</span>
                                <p>{perfil.tipoIdentificacion}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Nombre Completo</span>
                                <p>{perfil.nombre} {perfil.apellido}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Fecha de Nacimiento</span>
                                <p>{perfil.fechaNacimiento ? new Date(perfil.fechaNacimiento.split("T")[0] + "T00:00:00").toLocaleDateString() : "No disponible"}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Género</span>
                                <p>{perfil.genero}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Correo Electrónico</span>
                                <p>{perfil.correo}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Teléfono</span>
                                <p>{perfil.telefono}</p>
                            </div>
                            <div className={style.dataItem}>
                                <span>Rol en el Sistema</span>
                                <p className={style.roleBadge}>
                                    {perfil.isAdmin === 3 ? "SuperAdministrador" : perfil.isAdmin === 2 ? "Administrador" : "Visitante"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className={style.loadingText}>Cargando Información...</p>
                    )}
                </div>

                <div className={style.buttonContainer}>
                    <button className={style.editButton} onClick={() => setIsFormModalOpen(true)}>
                        <FaEdit /> Editar Perfil
                    </button>
                    <button className={style.btnChangePassword} onClick={() => setIsPasswordModalOpen(true)}>
                        <FaLock /> Contraseña
                    </button>
                    <button className={style.btnDeleteAccount} onClick={handleDeleteProfile}>
                        <FaTrash /> Eliminar Cuenta
                    </button>
                </div>
            </div>

            <PerfilModalForm isOpen={isFormModalOpen} closeModal={() => setIsFormModalOpen(false)} onSave={handleSave} perfilData={perfil} />
            <PerfilModalChPassword isOpen={isPasswordModalOpen} closeModal={() => setIsPasswordModalOpen(false)} onSave={handleSavePassword} />
        </PageLayout>
    );
}

export default Perfil;
