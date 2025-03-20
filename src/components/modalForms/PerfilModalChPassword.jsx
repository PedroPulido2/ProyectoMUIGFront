import React, { useEffect, useState } from "react";
import api from "../../services/api";
import '../../styles/FormModal.css';
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { showNotification } from "../../utils/showNotification";

const PerfilModalChPassword = ({ isOpen, closeModal, onSave }) => {
    const username = localStorage.getItem("username") || "Invitado";
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [errorMessage, setErrorMessage] = useState("");

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const passwordsMatch = formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordsMatch) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await api.post(`/login/verify`, { password: formData.currentPassword },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!response.data.valid) {
                setErrorMessage("La contraseña actual es incorrecta.");
                return;
            }

            setErrorMessage("");
            onSave(formData.newPassword);
            closeModal();
        } catch (error) {
            console.error("Error al actualizar la contraseña", error);
            showNotification("warning", "Error", "Sesión expirada. Inicia sesión nuevamente.");

        }
    };

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className="modal-form" onClick={closeModal}>
                <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
                    <span className="close-form" onClick={closeModal}>
                        &times;
                    </span>
                    <h3>Cambiar Contraseña</h3>
                    <br />
                    <br />
                    <form onSubmit={handleSubmit}>
                        <label>
                            Contraseña Actual:
                            <div className="password-container">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="currentPassword"
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" onClick={() => togglePasswordVisibility("current")}>
                                    {showPassword.current ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </label>
                        <label>
                            Nueva Contraseña:
                            <div className="password-container">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="newPassword"
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" onClick={() => togglePasswordVisibility("new")}>
                                    {showPassword.new ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </label>

                        <label>
                            Confirmar Contraseña:
                            <div className="password-container">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" onClick={() => togglePasswordVisibility("confirm")}>
                                    {showPassword.confirm ? <EyeOff /> : <Eye />}
                                </button>
                                {formData.confirmPassword && (
                                    <div className="validation-icon">
                                        {passwordsMatch ? <CheckCircle className="icon-success" /> : <XCircle className="icon-error" />}
                                    </div>
                                )}
                            </div>
                        </label>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <br />
                        <button type="submit" className="save-button">Guardar</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default PerfilModalChPassword;