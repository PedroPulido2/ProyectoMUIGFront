import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from '../utils/showNotification';
import styles from '../styles/Login.module.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Restablecer contraseña";
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Regla fuerte del registro, con mínimo de 8 según contrato del backend
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showNotification(
                "error",
                "Contraseña inválida",
                "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número."
            );
            return;
        }

        if (password !== confirmPassword) {
            showNotification("error", "Error de confirmación", "Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/login/reset-password', { token, password });
            showNotification("success", "¡Contraseña actualizada!", response.data?.message || "Ya puedes iniciar sesión con tu nueva contraseña.");
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error de conexión. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        <img src="/Logo.png" alt="Logo" className={styles.loginLogo} />
                        <h2>Restablecer contraseña</h2>
                        <p>El enlace es inválido o ha expirado</p>
                    </div>
                    <div className={styles.loginFooter}>
                        <button className={styles.registerButton} onClick={() => navigate('/forgot-password')}>
                            Solicitar un nuevo enlace
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <img src="/Logo.png" alt="Logo" className={styles.loginLogo} />
                    <h2>Restablecer contraseña</h2>
                    <p>Ingresa tu nueva contraseña (mín. 8 caracteres, una mayúscula, una minúscula y un número)</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginFormContent}>
                    <div className={styles.formGroup}>
                        <label>Nueva contraseña</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePass}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Confirmar contraseña</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button type="submit" className={styles.saveButton} disabled={loading}>
                        {loading ? 'Guardando...' : 'Restablecer contraseña'}
                    </button>
                </form>

                <div className={styles.loginFooter}>
                    <button className={styles.registerButton} onClick={() => navigate('/')}>
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
