import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import rutaImagenPerfil from '../styles/images/profile-img.jpg';
import '../styles/Perfil.css'

const Perfil = ({ setAuth }) => {
    const username = localStorage.getItem("username") || "Invitado";
    const [perfil,setPerfil] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        genero: "",
        usuario: username,
        FOTO: rutaImagenPerfil,
    });

    useEffect(() => {
        document.title = "Perfil";
    }, []);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setPerfil({...Perfil, FOTO: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <PageLayout username={username} setAuth={setAuth}>
            <div className="main">
                <h2>Configuración del Perfil</h2>
                <br />
                <div className="infPerfil">
                    <div className="imagen-container">
                        <img src={rutaImagenPerfil} alt="Perfil" className="editable-img"/>
                        <input type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="input-file"/>
                    </div>

                    <div className="info-container">
                        <h3>Información personal</h3>
                        <br />
                        <p><strong>Id:</strong> {perfil.nombre}</p>
                        <p><strong>Nombre:</strong> {perfil.nombre}</p>
                        <p><strong>Apellido:</strong> {perfil.apellido}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {perfil.fechaNacimiento}</p>
                        <p><strong>Género:</strong> {perfil.genero}</p>
                        <p><strong>Usuario:</strong> {perfil.usuario}</p>

                        <button className="btn-change-password">Cambiar Contraseña</button>
                        <button className="btn-delete-account">Eliminar Cuenta</button>

                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

export default Perfil;
