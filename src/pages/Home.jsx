import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Home.css';
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
    console.log(module)
    navigate(`/${module}`);
  };

  return (
    <PageLayout username={username} setAuth={setAuth}>

      <div className="main">
        <h2>Bienvenido a la página principal </h2>
        <br />
        <p>Por favor selecciona uno de los siguientes modulos:</p>
        <br />
        <div className="selectModules">
          <div className="module" onClick={() => handleModuleSelection("fosil")}>
            <img src={imagenFosil} alt="Gestión Fósiles" />
            <span>Gestión Fósiles</span>
          </div>
          <div className="module" onClick={() => handleModuleSelection("mineral")}>
            <img src={imagenMineral} alt="Gestión Minerales" />
            <span>Gestión Minerales</span>
          </div>
          <div className="module" onClick={() => handleModuleSelection("roca")}>
            <img src={imagenRoca} alt="Gestión Rocas" />
            <span>Gestión Rocas</span>
          </div>
          <div className="module" onClick={() => handleModuleSelection("investigacion")}>
            <img src={imagenInvestigacion} alt="Gestión Investigación" />
            <span>Gestión Investigación</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
