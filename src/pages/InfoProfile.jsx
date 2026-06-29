import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  Ban,
  Info,
  ShieldCheck,
  Key,
  Beaker,
  Gem,
  Library,
  GraduationCap, UserCog
} from "lucide-react";
import { motion } from 'motion/react';
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import { showNotification, showConfirmation } from "../utils/showNotification";

import style from '../styles/InfoProfile.module.css';

// Default images placeholders
import imagenProfileFemale from '../styles/images/profile-female.jpg';
import imagenProfileMale from '../styles/images/profile-male.jpg';
import imagenProfileOther from '../styles/images/profile-other.jpg';

const InfoProfile = ({ setAuth }) => {
  const { id: id_from_params } = useParams();
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Invitado";
  const current_user_id_perfil = localStorage.getItem("id_Perfil") || "1002558632"; // Fallback for demo
  const current_perm_perfil = Number(localStorage.getItem("perm_perfil")) || 0;
  const current_isAdmin = Number(localStorage.getItem('isAdmin')) || 0;

  const [perfil, setPerfil] = useState({});
  const [loading, setLoading] = useState(true);
  const [urlFoto, setUrlFoto] = useState("");

  const [permissions, setPermissions] = useState({
    perm_fosil: 0,
    perm_mineral: 0,
    perm_roca: 0,
    perm_investigacion: 0,
    perm_perfil: 0
  });
  const [savingPerms, setSavingPerms] = useState(false);

  const active_id_perfil = id_from_params || current_user_id_perfil;

  useEffect(() => {
    document.title = "Datos del Perfil";
    if (active_id_perfil) {
      fetchData();
    }
  }, [active_id_perfil]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/perfil/${active_id_perfil}`);

      if (response.data && response.data.length > 0) {
        const perfilData = response.data[0];
        setPerfil(perfilData);
        setUrlFoto(perfilData.foto || "");
        setPermissions({
          perm_fosil: perfilData.perm_fosil,
          perm_mineral: perfilData.perm_mineral,
          perm_roca: perfilData.perm_roca,
          perm_investigacion: perfilData.perm_investigacion,
          perm_perfil: perfilData.perm_perfil
        });
      } else if (response.data && !Array.isArray(response.data)) {
        setPerfil(response.data);
        setUrlFoto(response.data.foto || "");
        setPermissions({
          perm_fosil: response.data.perm_fosil,
          perm_mineral: response.data.perm_mineral,
          perm_roca: response.data.perm_roca,
          perm_investigacion: response.data.perm_investigacion,
          perm_perfil: response.data.perm_perfil
        });
      } else {
        setPerfil({ foto: "" });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setPerfil({ foto: "" });
      setUrlFoto("");
      showNotification("error", "Error al obtener los datos", err.response?.data?.error || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    setSavingPerms(true);
    try {
      const response = await api.put(`/perfil/${perfil.id_Perfil}/permissions`, {
        ...permissions,
        usernameAccion: username
      });

      if (response.status === 200) {
        showNotification("success", "¡Éxito!", "Niveles de acceso actualizados correctamente.");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      showNotification("error", "Error", error.response?.data?.error || "No se pudieron guardar los permisos.");
    } finally {
      setSavingPerms(false);
    }
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      return showNotification("warning", "Formato no válido", "Por favor, selecciona una imagen en formato JPG o PNG.");
    }

    const formData = new FormData();
    formData.append("id_Perfil", perfil.id_Perfil);
    Object.keys(perfil).forEach(key => {
      if (key !== "foto" && key !== "id_Perfil") {
        let value = perfil[key];
        if (key === "fechaNacimiento" && typeof value === "string") {
          value = value.split("T")[0];
        }
        formData.append(key, value);
      }
    });
    formData.append("foto", file);
    formData.append("idPerfilAccion", current_user_id_perfil);
    formData.append("usernameAccion", username);

    try {
      const response = await api.put(`/perfil/${perfil.id_Perfil}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        await fetchData();
        showNotification("success", "¡Éxito!", "Foto de perfil actualizada con éxito.");
      }
    } catch (error) {
      console.error("Error al actualizar la foto:", error);
      showNotification("error", "Error", error.response?.data?.error || "Hubo un error al actualizar la foto.");
    }
  };

  const handleDeleteProfile = async () => {
    const confirmDelete = await showConfirmation("¿Está seguro?", "Esta acción eliminará su perfil permanentemente.");
    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/perfil/${perfil.id_Perfil}`, {
          data: {
            idPerfilAccion: current_user_id_perfil,
            usernameAccion: username,
          }
        });
        showNotification("success", "¡Perfil Eliminado!", "El perfil ha sido eliminado.");
        if (perfil.id_Perfil == current_user_id_perfil) {
          localStorage.clear();
          if (setAuth) setAuth(false);
          navigate("/");
        } else {
          navigate("/profiles");
        }
      } catch (error) {
        console.error("Error al eliminar el perfil:", error);
        showNotification("error", "Error", error.response?.data?.error || "Ocurrió un error inesperado.");
      }
    }
  };

  if (loading) return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-on-surface-variant font-medium">Cargando datos del perfil...</p>
      </div>
    </PageLayout>
  );

  const fotoFinal = perfil.foto
    ? (perfil.foto.includes('drive.google.com')
      ? `/api/imagen/load/${perfil.foto.split('/d/')[1]?.split('/')[0] || null}`
      : perfil.foto)
    : (perfil.genero === "Masculino" ? imagenProfileMale : perfil.genero === "Femenino" ? imagenProfileFemale : imagenProfileOther);

  const accessModules = [
    { id: 'perm_fosil', name: 'Fosil', icon: Library, enabled: permissions.perm_fosil === 1 },
    { id: 'perm_mineral', name: 'Minerales', icon: Gem, enabled: permissions.perm_mineral === 1 },
    { id: 'perm_roca', name: 'Rocas', icon: GraduationCap, enabled: permissions.perm_roca === 1 },
    { id: 'perm_investigacion', name: 'Investigacion', icon: Beaker, enabled: permissions.perm_investigacion === 1 },
    { id: 'perm_perfil', name: 'Perfiles', icon: UserCog, enabled: permissions.perm_perfil === 1 },
  ];


  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className={style.container}>
        {/* Breadcrumb */}
        <nav className={style.breadcrumb}>
          <Link to="/sd/profiles">Profiles</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-on-surface">Detail</span>
        </nav>

        {/* Header Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={style.headerCard}
        >
          <div className={style.headerGradient} />

          <div className={style.profileImageContainer}>
            <img src={fotoFinal} alt={perfil.nombre} className={style.profileImage} />
            {current_isAdmin === 3 || (current_isAdmin === 2 && current_perm_perfil === 1) && (
              <label htmlFor="upload-photo" className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform shadow-md">
                <Pencil className="w-4 h-4" />
                <input type="file" id="upload-photo" hidden onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className={style.headerInfo}>
            <div className={style.nameRow}>
              <h1 className={style.name}>{perfil.nombre} {perfil.apellido}</h1>
              <span
                className={`flex w-fit items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1 border ${perfil.estado === 'ACTIVO'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
                  }`}
              >
                {/* Círculo indicador de estado */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${perfil.estado === 'ACTIVO' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                ></span>

                {/* Texto del estado */}
                {perfil.estado === 'ACTIVO' ? 'Activo' : 'Bloqueado'}
              </span>
            </div>

            {/* Renderizado condicional de los botones de acción */}
            {(current_isAdmin >= 2 && current_perm_perfil === 1) && (
              <div className={style.actionButtons}>
                <button className={style.btnPrimary} onClick={() => navigate(`/perfil/edit/${perfil.id_Perfil}`)}>
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className={style.btnSecondary} onClick={handleDeleteProfile}>
                  <Ban className="w-4 h-4" />
                  Delete Profile
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Personal Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={style.section}
        >
          <div className={style.sectionHeader}>
            <Info className="w-6 h-6 text-primary" />
            <h2 className={style.sectionTitle}>Personal Information</h2>
          </div>

          <div className={style.infoGrid}>
            <InfoField label="ID_Perfil" value={perfil.id_Perfil} />
            <InfoField label="Usuario" value={perfil.correo?.split('@')[0]} />
            <InfoField label="Rol" value={
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                {perfil.isAdmin === 2 ? 'Admin' : 'User'}
              </div>
            } />
            <InfoField label="Nombre y Apellido" value={`${perfil.nombre} ${perfil.apellido}`} />
            <InfoField label="Tipo de Identificación" value={perfil.tipoIdentificacion} />
            <InfoField label="Fecha de Nacimiento" value={new Date(perfil.fechaNacimiento).toLocaleDateString()} />
            <InfoField label="Género" value={perfil.genero} />
            <InfoField label="Correo" value={perfil.correo} isLink />
            <InfoField label="Teléfono" value={perfil.telefono} />
          </div>

          <div className={style.footerInfo}>
            <p className={style.footerLabel}>Fecha de Creación</p>
            <p className={style.footerText}>Account created on {new Date(perfil.fechaCreacion).toLocaleDateString()} by System Administrator</p>
          </div>
        </motion.section>

        {(current_isAdmin >= 2 && perfil.isAdmin >= 2) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={style.section}
          >
            <div className={style.accessHeader}>
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-primary" />
                <h2 className={style.sectionTitle}>Niveles de Acceso</h2>
              </div>
              <span className="text-sm text-on-surface-variant italic">Control de permisos de modulos</span>
            </div>

            {/* Lógica propia del perfil que se está visualizando */}
            {perfil.isAdmin === 3 ? (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Tiene todos los permisos de los módulos.</span>
              </div>
            ) : (
              <>
                <div className={style.accessGrid}>
                  {accessModules.map((mod) => (
                    <div key={mod.id} className={style.accessCard}>
                      <div className={style.accessInfo}>
                        <div className={style.accessIcon}>
                          <mod.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={style.accessName}>{mod.name}</p>
                          <p className={style.accessDesc}>{mod.enabled ? 'Acceso de editar' : 'Sin Acceso a editar'}</p>
                        </div>
                      </div>
                      <div
                        className={style.toggle}
                        data-state={mod.enabled ? 'active' : 'inactive'}
                        onClick={() => {
                          if (setPermissions) {
                            togglePermission(mod.id);
                          }
                        }}
                      >
                        <span className={style.toggleHandle} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className={`${style.btnPrimary} px-8`}
                    onClick={handleSavePermissions}
                    disabled={savingPerms}
                  >
                    {savingPerms ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.section>
        )}
      </div>
    </PageLayout>
  );
}

function InfoField({ label, value, isLink = false }) {
  return (
    <div className={style.field}>
      <p className={style.label}>{label}</p>
      <div className={`${style.value} ${isLink ? style.valueLink : ''}`}>
        {value}
      </div>
    </div>
  );
}

export default InfoProfile;
