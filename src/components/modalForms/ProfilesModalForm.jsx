import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from "../../utils/showNotification";

const ProfilesModalForm = ({ isOpen, closeModal, onSave, profileData }) => {
    const [formData, setFormData] = useState({
        id_Perfil: "",
        tipoIdentificacion: "",
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        genero: "",
        correo: "",
        telefono: "",
        foto: "",
        user: "",
        password: "",
        isAdmin: ""
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    useEffect(() => {
        if (profileData) {
            setFormData({
                id_Perfil: profileData.ID_PERFIL || "",
                tipoIdentificacion: profileData.TIPO_IDENTIFICACION || "",
                nombre: profileData.NOMBRE || "",
                apellido: profileData.APELLIDO || "",
                fechaNacimiento: profileData.FECHA_NACIMIENTO || "",
                genero: profileData.GENERO || "",
                correo: profileData.CORREO || "",
                telefono: profileData.TELEFONO || "",
                foto: profileData.FOTO || "",
                user: profileData.USER || "",
                password: "",
                isAdmin: profileData.IS_ADMIN || ""
            });
        } else {
            setFormData({
                id_Perfil: "",
                tipoIdentificacion: "",
                nombre: "",
                apellido: "",
                fechaNacimiento: "",
                genero: "",
                correo: "",
                telefono: "",
                foto: "",
                user: "",
                password: "",
                isAdmin: ""
            });
        }
    }, [profileData]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        const invalidSequences = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"];

        if (name === "tipoIdentificacion") {
            setFormData({
                ...formData,
                tipoIdentificacion: value,
            });
            return;
        }

        if (name === "id_Perfil") {
            if (invalidSequences.includes(value)) return;
            if (formData.tipoIdentificacion === "Pasaporte") {
                if (!/^[a-zA-Z0-9]*$/.test(value)) return;
                if (value.length > 12) return;
            } else {
                // Otros documentos: solo números, hasta 12 dígitos
                if (!/^\d*$/.test(value)) return;
                if (value.length > 12) return;
            }
        }

        if (name === "nombre" || name === "apellido") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
        }

        // Validación del teléfono (solo números)
        if (name === "telefono") {
            if (invalidSequences.includes(value)) return;
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 10) return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Verificar si el archivo es una imagen
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validImageTypes.includes(file.type)) {
            showNotification("warning", "Formato no válido", "Por favor, selecciona una imagen en formato JPG, JPEG o PNG.");

            e.target.value = "";
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            foto: file,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar edad mínima (14 años)
        const today = new Date();
        const birthDate = new Date(formData.fechaNacimiento);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            age < 14 ||
            (age === 14 && monthDiff < 0) ||
            (age === 14 && monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            showNotification("error", "Edad inválida", "El usuario debe tener al menos 14 años.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            showNotification("error", "Correo inválido", "Ingrese un correo electrónico válido.");
            return;
        }

        if (formData.id_Perfil.length >= 1 && formData.id_Perfil.length < 5){
            showNotification("error", "Id Perfil invalido", "El id Perfil debe tener al menos 5 caracteres.");
            return;
        }

        if (formData.telefono.length >= 1 && formData.telefono.length < 5){
            showNotification("error", "Telefono invalido", "El número de telefono debe tener al menos 5 caracteres.");
            return;
        }

        if (formData.password.length >= 1 && formData.password.length < 6) {
            showNotification("error", "Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const formattedData = {
            ...formData,
            fechaNacimiento: formData.fechaNacimiento || null
        };

        onSave(formattedData);
        closeModal();
    };

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className="modal-form" onClick={closeModal}>
                <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
                    <span className="close-form" onClick={closeModal}>
                        &times;
                    </span>
                    <h3>{profileData ? "Editar Perfil" : "Añadir Perfil"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID Perfil:</label>
                            <input
                                type="text"
                                name="id_Perfil"
                                value={formData.id_Perfil}
                                onChange={handleChange}
                                required
                            //disabled={fosilData} // No editable para edición
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo de identificación:</label>
                            <select className="styled-select" name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} required>
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="Tarjeta de identidad">Targeta de identidad (TI)</option>
                                <option value="Cedula de Ciudadania">Cedula de Ciudadania (CC)</option>
                                <option value="Tarjeta de extranjeria">Tarjeta de extranjeria (TE)</option>
                                <option value="Cedula de extranjeria">Cedula de extranjeria (CE)</option>
                                <option value="Pasaporte">Pasaporte (PP)</option>
                                <option value="Permiso especial de permanencia">Permiso especial de permanencia (PEP)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido:</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de nacimiento:</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Genero:</label>
                            <select className="styled-select" name="genero" value={formData.genero} onChange={handleChange} required>
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Correo:</label>
                            <input
                                type="text"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefono:</label>
                            <input
                                type="number"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Foto:</label>
                            <input
                                type="file"
                                name="foto"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Usuario:</label>
                            <input
                                type="text"
                                name="user"
                                value={formData.user}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <div className="password-container">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button type="button" onClick={() => togglePasswordVisibility("new")}>
                                    {showPassword.new ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tipo de Rol:</label>
                            <select className="styled-select" name="isAdmin" value={formData.isAdmin} onChange={handleChange} required>
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="1">Visitante</option>
                                <option value="2">Administrador</option>
                                <option value="3">Super-Administrador</option>
                            </select>
                        </div>
                        <button type="submit" className="save-button">
                            {profileData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default ProfilesModalForm;