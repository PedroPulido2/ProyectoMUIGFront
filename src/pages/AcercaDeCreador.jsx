import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import imagenCreador from '../styles/images/Creador.jpeg';
import styles from '../styles/AboutMe.module.css';

const AcercaDeCreador = ({ setAuth }) => {
  const [username] = useState(localStorage.getItem("username") || "Invitado");

  useEffect(() => {
    document.title = "Sobre el Creador";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
        <div className={styles.aboutContainer}>
          <h2>Acerca del Creador</h2>
          <div className={styles.profileImageContainer}>
            <img src={imagenCreador} alt="Foto de Pedro Alonso Pulido Hernández, creador del sitio" className={styles.profileImage} />
          </div>
          <h3 className={styles.name}><strong>Pedro Alonso Pulido Hernández</strong></h3>
          <p className={styles.description}>
            Desarrollador del sitio Web (Back-end, Front-end y diseñador de la Base de datos).
            Apasionado por la tecnología y el desarrollo de software.
            Creo soluciones digitales que optimizan procesos y mejoran la experiencia del usuario.
          </p>
          <br />
          <p className={styles.contact}>
            📧 Contacto personal: <a href="mailto:pedropulido1104@gmail.com">pedropulido1104@gmail.com</a><br />
            📧 Contacto institucional: <a href="mailto:pedro.pulido01@uptc.edu.co">pedro.pulido01@uptc.edu.co</a><br />
            {/* 🌐 Portafolio: 
<a href="https://www.linkedin.com/in/pedro-alonso-pulido-hernández-134936181" 
   target="_blank" 
   rel="noopener noreferrer">
   LinkedIn
</a><br /> */}
            <br /><br /><br />
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
    </PageLayout>
  );
};

export default AcercaDeCreador;
