import React, { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "../../styles/FormModal.module.css";
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

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            setErrorMessage("La contraseña debe tener mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número.");
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
            <div className={styles.modalForm} onClick={closeModal}>
                <div className={styles.modalContentForm} onClick={(e) => e.stopPropagation()}>
                    <span className={styles.closeForm} onClick={closeModal}>
                        &times;
                    </span>
                    <h3>Cambiar Contraseña</h3>
                    <br />
                    <br />
                    <div className={styles.formGroup}>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Contraseña Actual:
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword.current ? "text" : "password"}
                                        name="currentPassword"
                                        onChange={handleChange}
                                        required
                                    />
                                    <button className={styles.eyepassword} type="button" onClick={() => togglePasswordVisibility("current")}>
                                        {showPassword.current ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>
                            </label>
                            <label>
                                Nueva Contraseña:
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        name="newPassword"
                                        onChange={handleChange}
                                        required
                                    />
                                    <button className={styles.eyepassword} type="button" onClick={() => togglePasswordVisibility("new")}>
                                        {showPassword.new ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>
                            </label>

                            <label>
                                Confirmar Contraseña:
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        onChange={handleChange}
                                        required
                                    />
                                    <button className={styles.eyepassword} type="button" onClick={() => togglePasswordVisibility("confirm")}>
                                        {showPassword.confirm ? <Eye /> : <EyeOff />}
                                    </button>
                                    {formData.confirmPassword && (
                                        <div className={styles.validationIcon}>
                                            {passwordsMatch ? <CheckCircle className={styles.iconSuccess} /> : <XCircle className={styles.iconError} />}
                                        </div>
                                    )}
                                </div>
                            </label>
                            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                            <br />
                            <button type="submit" className={styles.saveButton}>Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
};

export default PerfilModalChPassword;