import React, { useEffect } from "react";
import PageLayout from "./PageLayout";

const Home = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  useEffect(() => {
    document.title = "Inicio MUIG";
  }, []);

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <h2>Bienvenido a la página principal</h2>
      <p>Sección del contenido principal</p>
      <p>{username}</p>
    </PageLayout>
  );
};

export default Home;
