import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import { showNotification, showConfirmation } from "../utils/showNotification";
import { Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import styles from '../styles/Profiles.module.css';

import imagenProfileFemale from '../styles/images/profile-female.jpg';
import imagenProfileMale from '../styles/images/profile-male.jpg';
import imagenProfileOther from '../styles/images/profile-other.jpg';

const Profiles = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isAdmin = Number(localStorage.getItem('isAdmin')) || 0;
  const current_perm_perfil = Number(localStorage.getItem("perm_perfil")) || 0;
  const navigate = useNavigate();

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

  const filteredData = useMemo(() => {
    return profiles.filter((p) =>
      `${p.NOMBRE} ${p.APELLIDO}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ROL.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [profiles, searchTerm]);

  const superAdmins = useMemo(() =>
    profiles.filter(p => p.IS_ADMIN === 3).slice(0, 3),
    [profiles]);


  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className={styles.container}>

        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Perfiles</h1>
          <p className={styles.subtitle}>
            Ahora eres parte de esta gran fuente de informacion. Explora los perfiles registrados y descubre quiénes forman parte de esta comunidad.
          </p>
        </motion.div>

        {/* Sección Superadministradores */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Superadministradores</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {superAdmins.map((admin, idx) => (
              <motion.div
                key={admin.ID_PERFIL}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="relative mb-2">
                  <img
                    src={admin.FOTO ? `/api/imagen/load/${admin.FOTO.split('/d/')[1]?.split('/')[0] || null}` : admin.GENERO === "Masculino" ? imagenProfileMale : admin.GENERO === "Femenino" ? imagenProfileFemale : imagenProfileOther}
                    alt={admin.NOMBRE}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-brand-primary)] shadow-sm group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-sm font-medium text-[var(--color-brand-on-surface)]">{admin.NOMBRE}</span>
              </motion.div>
            ))}
          </div>

          {/* Barra de Búsqueda */}
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar perfiles por nombre..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* Cuadrícula de Perfiles */}
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredData.map((perfil, index) => (
              <motion.div
                key={perfil.ID_PERFIL}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={styles.card}
              >
                <div className={styles.avatarWrapper}>
                  <img
                    src={perfil.FOTO ? `/api/imagen/load/${perfil.FOTO.split('/d/')[1]?.split('/')[0] || null}` : perfil.GENERO === "Masculino" ? imagenProfileMale : perfil.GENERO === "Femenino" ? imagenProfileFemale : imagenProfileOther}
                    alt={perfil.NOMBRE}
                    className={styles.avatar}
                  />
                  <div
                    className={styles.statusIndicator}
                    style={{ backgroundColor: perfil.ESTADO === 'ACTIVO' ? '#22c55e' : '#c6371e' }}
                    title={perfil.ESTADO}
                  />
                </div>

                <h3 className={styles.name}>{perfil.NOMBRE} {perfil.APELLIDO}</h3>
                <p className={styles.role}>{perfil.ROL}</p>

                <span className={styles.badge}>
                  {perfil.GENERO || 'No definido'}
                </span>

                {isAdmin === 3 || (isAdmin === 2 && current_perm_perfil === 1) ?
                  <button
                    className={styles.button}
                    onClick={() => navigate(`/perfil/${perfil.ID_PERFIL}`)}
                  >
                    <Info size={16} />
                    Más información
                  </button> : <></>
                }

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">
            No se encontraron perfiles que coincidan con "{searchTerm}"
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Profiles;