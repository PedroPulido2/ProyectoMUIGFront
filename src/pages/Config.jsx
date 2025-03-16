import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Main.css'

const Config = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";


  useEffect(() => {
    document.title = "Configuración General";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Configuración General</h2>
      </div>
    </PageLayout>
  );
};

export default Config;