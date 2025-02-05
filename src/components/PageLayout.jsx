import React, { useState } from "react";
import '../styles/PageLayout.css';
import rutaLogo from '../styles/images/logo.png';
import rutaImagenPerfil from '../styles/images/profile-img.jpg';
import { Link } from "react-router-dom";

const PageLayout = ({ username, setAuth, children }) => {

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        setAuth(false);
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <img src={rutaLogo} />
                    <h2>Menu</h2>
                </div>
                <ul className="sidebar-links">
                    <h4>
                        <span>Menú Principal</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link to="/home"><span className="material-symbols-outlined">Home</span>Inicio</Link>
                    </li>
                    <li>
                        <Link to="/fosil"><span className="material-symbols-outlined">skull</span>Fosil</Link>
                    </li>
                    <li>
                        <Link to="/mineral"><span className="material-symbols-outlined">diamond</span>Mineral</Link>
                    </li>
                    <li>
                        <Link to="/roca"><span className="material-symbols-outlined">terrain</span>Roca</Link>
                    </li>
                    <li>
                        <Link to="/investigacion"><span className="material-symbols-outlined">science</span>Investigación</Link>
                    </li>
                    <h4>
                        <span>Cuenta</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link to="#"><span className="material-symbols-outlined">account_circle</span>Perfil</Link>
                    </li>
                    <li>
                        <Link to="#"><span className="material-symbols-outlined">settings</span>Configuración</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}><span className="material-symbols-outlined">Logout</span>Cerrar Sesión</button>
                    </li>
                </ul>
                <div className="user-account">
                    <div className="user-profile">
                        <img src={rutaImagenPerfil}
                            alt="profile-img" />
                        <div className="user-detail">
                            <h3>{username}</h3>
                            <span>Administrador</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contenido Principal */}
            <div className="page-content">
                <header className="page-header">
                    <h1>Gestion Inventario MUIG-UPTC</h1>
                </header>

                <main className="page-main">
                    {children} {/* Esto renderiza los hijos pasados desde Home.jsx */}
                </main>

            </div>
        </div>
    );
};

export default PageLayout;
