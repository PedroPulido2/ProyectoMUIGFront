import React, { useEffect } from "react";
import PageLayout from "./PageLayout";

const Fosil = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  useEffect(() => {
    document.title = "Gestion Fosiles";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <h2>Bienvenido a la página Fosil</h2>
      <p>Sección del contenido Fosil</p>
      <p>{username}</p>
    </PageLayout>
  );
  
};

export default Fosil;