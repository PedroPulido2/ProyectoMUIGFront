import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import TableComponent from "../components/TableComponent";
import ProfilesModalForm from "../components/modalForms/ProfilesModalForm";
import { showNotification, showConfirmation } from "../utils/showNotification";
import { data } from "react-router-dom";
import { use } from "react";
import { Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Profiles = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [profiles, setProfiles] = useState([]);

  const idPerfilAccion = localStorage.getItem("id_Perfil") || "";
  const usernameAccion = localStorage.getItem("username") || "";

  useEffect(() => {
    document.title = "Gestión de Perfiles";
    fetchData();
  }, []);

  //Peticiones al Backend, para obtener los datos
  const fetchData = async () => {
    try {
      const response = await api.get("/perfil");

      // Filtrar los perfiles para excluir el del usuario actual
      const filteredProfiles = response.data.filter(profile => profile.USER?.trim() !== username?.trim());

      // Transformar los datos agregando la propiedad "ROL" y formateando las fechas
      const formattedProfiles = filteredProfiles.map(profile => ({
        ...profile,
        ROL: profile.IS_ADMIN === 1 ? "Visitante" :
          profile.IS_ADMIN === 2 ? "Administrador" :
            "Super-Administrador",
      }));

      setProfiles(formattedProfiles);
    } catch (err) {
      console.error("Error al obtener los perfiles:", err);
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
    }
  };


  

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        
      </div>
    </PageLayout>
  );
};

export default Profiles;