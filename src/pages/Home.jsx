import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import styles from '../styles/Home.module.css';
import { useNavigate } from "react-router-dom";
import imagenFosil from '../styles/images/moduleFosil.jpg';
import imagenInvestigacion from '../styles/images/moduleInvestigacion.jpg';
import imagenMineral from '../styles/images/moduleMineral.jpg';
import imagenRoca from '../styles/images/moduleRoca.jpg';

const Home = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [selectedModule, setSelectedModule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Inicio MUIG";
  }, []);

  const handleModuleSelection = (module) => {
    setSelectedModule(module);
    navigate(`/${module}`);
  };
return (
    <PageLayout username={username} setAuth={setAuth}>
        <div className={styles.welcomeHeader}>
            <h2>Bienvenido a la página principal</h2>
            <p>Por favor selecciona uno de los siguientes módulos:</p>
        </div>

        <div className={styles.selectModules}>
          <div className={styles.module} onClick={() => handleModuleSelection("fosil")}>
            <div className={styles.imageContainer}>
                <img src={imagenFosil} alt="Gestión Fósiles" />
            </div>
            <span>Gestión Fósiles</span>
          </div>
          
          <div className={styles.module} onClick={() => handleModuleSelection("mineral")}>
            <div className={styles.imageContainer}>
                <img src={imagenMineral} alt="Gestión Minerales" />
            </div>
            <span>Gestión Minerales</span>
          </div>
          
          <div className={styles.module} onClick={() => handleModuleSelection("roca")}>
            <div className={styles.imageContainer}>
                <img src={imagenRoca} alt="Gestión Rocas" />
            </div>
            <span>Gestión Rocas</span>
          </div>
          
          <div className={styles.module} onClick={() => handleModuleSelection("investigacion")}>
            <div className={styles.imageContainer}>
                <img src={imagenInvestigacion} alt="Gestión Investigación" />
            </div>
            <span>Gestión Investigación</span>
          </div>
        </div>
    </PageLayout>
  );
};

export default Home;
