import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import '../styles/Login.css';

const Login = ({ setAuth }) => { // Recibimos setAuth como prop
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Iniciar Sesion";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/login/auth', { user, password });
            if (response.status === 200) {
                alert(response.data.message); // Mensaje de éxito

                const token = response.data.token;

                const decoded = jwtDecode(token);

                localStorage.setItem('token',token);
                localStorage.setItem('id_Perfil', decoded.id_Perfil);
                localStorage.setItem('username', user);
                localStorage.setItem('isAdmin', decoded.isAdmin);
                localStorage.setItem('urlFotoProfile', decoded.foto);

                setAuth(true); // Actualizar estado global y localStorage
                navigate('/home'); // Redirigir a página protegida
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Mostrar mensaje del backend
            } else {
                setError('Ocurrió un error inesperado. Intente nuevamente.');
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-form">
                <h2>Inicio de Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="user">Usuario:</label>
                        <input
                            type="text"
                            id="user"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Ingrese su usuario"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>
                    <br />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
