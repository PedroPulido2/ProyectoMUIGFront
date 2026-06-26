import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from '../utils/showNotification';
import styles from '../styles/Login.module.css';

const Login = ({ setAuth }) => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Inventario MUIG";
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login/auth', { user, password });
            if (response.status === 200) {
                showNotification("success", "¡Bienvenido de nuevo!", response.data.message);
                const token = response.data.token;
                const decoded = jwtDecode(token);

                localStorage.setItem('token', token);
                localStorage.setItem('id_Perfil', decoded.id_Perfil);
                localStorage.setItem('username', user);
                localStorage.setItem('isAdmin', decoded.isAdmin);
                localStorage.setItem('urlFotoProfile', decoded.foto);
                localStorage.setItem('perm_fosil', decoded.perm_fosil);
                localStorage.setItem('perm_mineral', decoded.perm_mineral);
                localStorage.setItem('perm_roca', decoded.perm_roca);
                localStorage.setItem('perm_investigacion', decoded.perm_investigacion);
                localStorage.setItem('perm_perfil', decoded.perm_perfil);

                setAuth(true);
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error de conexión. Intente nuevamente.');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <img src="/Logo.png" alt="Logo" className={styles.loginLogo} />
                    <h2>Bienvenido</h2>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleLogin} className={styles.loginFormContent}>
                    <div className={styles.formGroup}>
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Ej. usuario123"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Contraseña</label>
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

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button type="submit" className={styles.saveButton}>Ingresar</button>
                </form>

                <div className={styles.loginFooter}>
                    <span>¿No tienes cuenta?</span>
                    <button className={styles.registerButton} onClick={() => navigate('/register')}>
                        Crear cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;