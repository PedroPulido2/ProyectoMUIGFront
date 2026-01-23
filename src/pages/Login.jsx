import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from "lucide-react";
import { showNotification } from '../utils/showNotification';
import '../styles/Login.css';

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

                setAuth(true);
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error de conexión. Intente nuevamente.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src="/Logo.png" alt="Logo" className="login-logo" />
                    <h2>Bienvenido</h2>
                    <p>Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="login-form-content">
                    <div className="form-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Ej. usuario123"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <div className='password-wrapper'>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-pass"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="error-text">{error}</p>}
                    
                    <button type="submit" className="btn-primary">Ingresar</button>
                </form>

                <div className="login-footer">
                    <span>¿No tienes cuenta?</span>
                    <button className="btn-secondary" onClick={() => navigate('/register')}>
                        Crear cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;