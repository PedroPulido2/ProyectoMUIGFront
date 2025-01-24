import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = ({ setAuth, username }) => { // Recibimos setAuth como prop
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Ingreso Exitoso";
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated'); // Eliminar autenticación del localStorage
        setAuth(false); // Actualizar estado de autenticación global
        navigate('/'); // Redirigir al login
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Ingreso Exitoso</h1>
            <p>Bienvenido a la app</p>
            <p>{username}</p>
            <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px' }}>
                Cerrar Sesión
            </button>
        </div>
    );
};

export default Success;
