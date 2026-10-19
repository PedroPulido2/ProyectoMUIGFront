import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import imagenCreador from '../styles/images/Creador.jpeg';
import styles from '../styles/AboutMe.module.css';

const Creditos = ({ setAuth }) => {
  const [username] = useState(localStorage.getItem("username") || "Invitado");

  useEffect(() => {
    document.title = "Acerca del proyecto";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
        <div className={styles.aboutContainer}>
          <h2>Acerca del proyecto</h2>
          <p className={styles.description}>
            Sistema de inventario del Museo Universitario de Ingeniería Geológica (MUIG) -
            Universidad Pedagógica y Tecnológica de Colombia (UPTC).
            Permite gestionar y consultar las colecciones de fósiles, minerales, rocas
            y productos de investigación del museo.
          </p>
          <h3 className={styles.name}>Créditos</h3>
          <div className={styles.profileImageContainer}>
            <img src={imagenCreador} alt="Foto de Pedro Alonso Pulido Hernández, desarrollador del sitio" className={styles.profileImage} />
          </div>
          <p className={styles.description}>
            Desarrollado por <strong>Pedro Alonso Pulido Hernández</strong>
          </p>
          <p className={styles.contact}>
            📧 Contacto institucional: <a href="mailto:pedro.pulido01@uptc.edu.co">pedro.pulido01@uptc.edu.co</a>
            <br /><br /><br />
            © {new Date().getFullYear()} MUIG - UPTC. Todos los derechos reservados.
          </p>
        </div>
    </PageLayout>
  );
};

export default Creditos;
