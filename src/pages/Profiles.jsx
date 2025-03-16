import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Main.css'

const Profiles = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";


  useEffect(() => {
    document.title = "Configuración Perfiles";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Configuración Perfiles</h2>
      </div>
    </PageLayout>
  );
};

export default Profiles;