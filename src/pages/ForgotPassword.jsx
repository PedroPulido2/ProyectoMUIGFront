import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showNotification } from '../utils/showNotification';
import styles from '../styles/Login.module.css';

const ForgotPassword = () => {
    const [correo, setCorreo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Recuperar contraseña";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            showNotification("error", "Correo inválido", "Ingrese un correo electrónico válido.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/login/forgot-password', { correo });
        } catch (err) {
            // Mensaje genérico a propósito: no revelar si el correo existe o no.
            // Solo se muestra el error técnico si no hay respuesta del backend.
            if (!err.response) {
                setError('Error de conexión. Intente nuevamente.');
                setLoading(false);
                return;
            }
        }
        setLoading(false);
        showNotification(
            "success",
            "Solicitud recibida",
            "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña."
        );
        setCorreo('');
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <img src="/Logo.png" alt="Logo" className={styles.loginLogo} />
                    <h2>Recuperar contraseña</h2>
                    <p>Ingresa tu correo y te enviaremos instrucciones</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginFormContent}>
                    <div className={styles.formGroup}>
                        <label>Correo</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Ej. usuario@correo.com"
                            required
                        />
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button type="submit" className={styles.saveButton} disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar instrucciones'}
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

export default ForgotPassword;
