import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff, XCircle, CheckCircle } from "lucide-react";
import { showNotification } from "../utils/showNotification";
import "../styles/Register.css";

const Register = () => {
    const navigate = useNavigate();
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
        confirmPassword: "",
        isAdmin: "1",
        aceptaTerminos: false
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false
    });

    useEffect(() => {
        document.title = "Registrarse";
    }, []);

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const invalidSequences = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"];

        if (name === "tipoIdentificacion") {
            setFormData({
                ...formData,
                tipoIdentificacion: value,
                id_Perfil: "" // Limpia el número de documento
            });
            return;
        }

        if (name === "id_Perfil") {
            if (invalidSequences.includes(value)) return;
            if (formData.tipoIdentificacion === "Pasaporte") {
                if (!/^[a-zA-Z0-9]*$/.test(value)) return;
                if (value.length > 10) return;
            } else {
                // Otros documentos: solo números, hasta 12 dígitos
                if (!/^\d*$/.test(value)) return;
                if (value.length > 12) return;
            }
        }

        // Validación del teléfono (solo números)
        if (name === "telefono") {
            if (invalidSequences.includes(value)) return;
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 10) return;
        }

        if (name === "nombre" || name === "apellido") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
        }

        if (name === "correo") {
            // Patrón básico para validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                setError("El formato del correo no es válido.");
            } else {
                setError(""); // Limpia el error si es válido
            }
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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

        if (formData.id_Perfil.length >= 1 && formData.id_Perfil.length < 5) {
            showNotification("error", "Id Perfil invalido", "El id Perfil debe tener al menos 5 caracteres.");
            return;
        }

        if (formData.telefono.length >= 1 && formData.telefono.length < 5) {
            showNotification("error", "Telefono invalido", "El número de telefono debe tener al menos 5 caracteres.");
            return;
        }

        if (formData.user.length < 5) {
            showNotification("error", "Usuario inválido", "El usuario debe tener al menos 5 caracteres.");
            return;
        }

        // Validación de contraseña fuerte
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            showNotification(
                "error",
                "Contraseña inválida",
                "La contraseña debe tener mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número."
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showNotification("error", "Error de confirmación", "Las contraseñas no coinciden.");
            return;
        }

        if (!formData.aceptaTerminos) {
            showNotification("error", "Debes aceptar los términos", "Para continuar, acepta el tratamiento de datos personales.");
            return;
        }

        const formattedData = {
            ...formData,
            fechaNacimiento: formData.fechaNacimiento || null
        };

        try {
            const response = await api.post("/perfil", formattedData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 201) {
                showNotification("success", "¡Registro exitoso!", "Usuario registrado correctamente.");
                navigate("/");
            } else {
                setError("Error desconocido. Intente nuevamente.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error al registrar el usuario.");
        }
    };

    const passwordsMatch = formData.password === formData.confirmPassword;

    return (
        <div className="register-page">
            <div className="register-form">
                <h2>Registro de Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tipo de Documento:</label>
                        <select className="styled-select" name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} required>
                            <option value="" disabled>Seleccione una opción</option>
                            <option value="Tarjeta de identidad">Tarjeta de identidad (TI)</option>
                            <option value="Cedula de Ciudadania">Cédula de Ciudadanía (CC)</option>
                            <option value="Tarjeta de extranjeria">Tarjeta de extranjería (TE)</option>
                            <option value="Cedula de extranjeria">Cédula de extranjería (CE)</option>
                            <option value="Pasaporte">Pasaporte (PP)</option>
                            <option value="Permiso especial de permanencia">Permiso especial de permanencia (PEP)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Número de Documento:</label>
                        <input type="text" name="id_Perfil" value={formData.id_Perfil} onChange={handleChange} placeholder="Ingrese su número de documento" required />
                    </div>
                    <div className="form-group">
                        <label>Nombres:</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ingrese sus nombres" required />
                    </div>
                    <div className="form-group">
                        <label>Apellidos:</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Ingrese sus apellidos" required />
                    </div>
                    <div className="form-group">
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Género:</label>
                        <select className="styled-select" name="genero" value={formData.genero} onChange={handleChange} required>
                            <option value="" disabled>Seleccione una opción</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Correo:</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Ingrese su correo" required />
                    </div>
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ingrese su telefono" required />
                    </div>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input type="text" name="user" value={formData.user} onChange={handleChange} placeholder="Ingrese su usuario" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <div className="password-container">
                            <input
                                type={showPassword.new ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingrese su contraseña"
                                required
                            />
                            <button type="button" onClick={() => togglePasswordVisibility("new")}>
                                {showPassword.new ? <EyeOff /> : <Eye />}
                            </button>
                        </div>

                    </div>
                    <div className="form-group">
                        <label>Confirmar Contraseña:</label>
                        <div className="password-container">
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita la contraseña"
                                required
                            />
                            <button type="button" onClick={() => togglePasswordVisibility("confirm")}>
                                {showPassword.confirm ? <EyeOff /> : <Eye />}
                            </button>
                            {formData.confirmPassword && (
                                <div className="validation-icon">
                                    {passwordsMatch ? (
                                        <CheckCircle className="icon-success" />
                                    ) : (
                                        <XCircle className="icon-error" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group checkbox-group">
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                name="aceptaTerminos"
                                checked={formData.aceptaTerminos}
                                onChange={(e) =>
                                    setFormData({ ...formData, aceptaTerminos: e.target.checked })
                                }
                                required
                            />
                            <span className="checkmark"></span>
                            Acepto el tratamiento de mis datos personales según la política de privacidad.
                        </label>
                    </div>
                    <br />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button2">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
