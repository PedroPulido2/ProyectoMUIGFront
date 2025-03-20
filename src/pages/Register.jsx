import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
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
        isAdmin: "1"
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = "Registrarse";
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validación del número de documento (solo números y hasta 30 dígitos)
        if (name === "id_Perfil") {
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 30) return; // Máximo 30 dígitos
        }

        // Validación del teléfono (solo números)
        if (name === "telefono") {
            if (!/^\d*$/.test(value)) return; // Permite solo números
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

        if (formData.password.length < 6) {
            showNotification("error", "Contraseña inválida", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const formattedData = {
            ...formData,
            fechaNacimiento: formData.fechaNacimiento
                ? new Date(formData.fechaNacimiento).toISOString()
                : null
        };

        try {
            const response = await api.post("/perfil", formattedData);
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
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingrese su contraseña"
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
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
