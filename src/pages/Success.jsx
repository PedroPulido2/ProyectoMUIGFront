import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Ingreso Exitoso";
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Ingreso Exitoso</h1>
            <p>Bienvenido a la app</p>
            <button onClick={() => navigate('/')}>Cerrar Sesion</button>
        </div>
    );
};

export default Success;