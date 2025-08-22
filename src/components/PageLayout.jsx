import React, { useEffect, useRef, useState } from "react";
import '../styles/PageLayout.css';
import rutaLogo from '../styles/images/Logo-simuig3.png';
import { Link } from "react-router-dom";
import imagenProfileOther from '../styles/images/profile-other.jpg';

const PageLayout = ({ username, setAuth, children, urlimgProfile }) => {
    const [urlFoto, setUrlFoto] = useState(localStorage.getItem('urlFotoProfile') || urlimgProfile);
    const isAdmin = Number(localStorage.getItem('isAdmin')) || 0;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        setUrlFoto(localStorage.getItem('urlFotoProfile') || urlimgProfile);

        const handleClickOutside = (event) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [urlimgProfile, isSidebarOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("id_Perfil");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("urlFotoProfile")
        setAuth(false);
    };

    const getProfileImage = () => {
        try {
            if (!urlFoto) return imagenProfileOther;
            const photoId = urlFoto.split('/d/')[1]?.split('/')[0];
            return `${process.env.VITE_URL_BACK}/imagen/load/${photoId}`;
        } catch (error) {
            console.error("Error al obtener la imagen de perfil:", error);
            return imagenProfileOther;
        }
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <img src={rutaLogo} alt="Logo del sistema" />
                    <h2>Museo Universitario Ingeniería Geológica</h2>
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
                    {isAdmin === 3 ?
                        <li>
                            <Link to="/profiles"><span className="material-symbols-outlined">manage_accounts</span>Perfiles</Link>
                        </li> : <></>
                    }
                    <h4>
                        <span>Cuenta</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link to="/perfil"><span className="material-symbols-outlined">account_circle</span>Perfil</Link>
                    </li>
                    <h4>
                        <span>Creador</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <Link to="/aboutCreator"><span className="material-symbols-outlined">shield_person</span>Acerca del Creador</Link>
                    </li>
                    <h4>
                        <span>Acciones</span>
                        <div className="menu-separator"></div>
                    </h4>
                    <li>
                        <button onClick={handleLogout}><span className="material-symbols-outlined">Logout</span>Cerrar Sesión</button>
                    </li>
                </ul>
                <div className="user-account">
                    <div className="user-profile">
                        <img src={getProfileImage()} alt="profile-img" />
                        <div className="user-detail">
                            <h3>{username}</h3>
                            <span>{isAdmin === 3 ? "Super-Administrador" : isAdmin === 2 ? "Administrador" : "Visitante"}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contenido Principal */}
            <div className="page-content">
                <header className="page-header">
                    <button
                        ref={buttonRef}
                        className="menu-toggle material-symbols-outlined"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        menu
                    </button>
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
