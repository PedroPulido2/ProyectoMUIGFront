import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Save,
  X,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Upload
} from "lucide-react";
import { motion } from "motion/react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import { showNotification } from "../utils/showNotification";

import style from "../styles/EditProfile.module.css";

import imagenProfileFemale from "../styles/images/profile-female.jpg";
import imagenProfileMale from "../styles/images/profile-male.jpg";
import imagenProfileOther from "../styles/images/profile-other.jpg";

const EditProfile = ({ setAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const current_user_id_perfil = localStorage.getItem("id_Perfil") || "";
  const username = localStorage.getItem("username") || "Invitado";
  const current_user_role = Number(localStorage.getItem("isAdmin")) || 1;
  const current_isAdmin = Number(localStorage.getItem('isAdmin')) || 0;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [originalId, setOriginalId] = useState("");
  const [urlFoto, setUrlFoto] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    id_Perfil: "",
    tipoIdentificacion: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    isAdmin: "1",
    estado: "ACTIVO"
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  useEffect(() => {
    document.title = "Editar Perfil";
    checkAuthAndLoad();
  }, [id]);

  const checkAuthAndLoad = async () => {
    try {
      // Check auth role and profile permissions
      if (current_user_role === 3) {
        setIsAuthorized(true);
        await fetchProfileData();
      } else if (current_user_role === 2) {
        const res = await api.get(`/perfil/${current_user_id_perfil}`);
        const pData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (pData && pData.perm_perfil === 1) {
          setIsAuthorized(true);
          await fetchProfileData();
        } else {
          setIsAuthorized(false);
          setLoading(false);
        }
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error al validar autorización:", err);
      setIsAuthorized(false);
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Obtener detalles del perfil
      const resProfile = await api.get(`/perfil/${id}`);
      const profileData = Array.isArray(resProfile.data) ? resProfile.data[0] : resProfile.data;

      if (!profileData) {
        showNotification("error", "Error", "El perfil no existe.");
        navigate("/sd/profiles");
        return;
      }

      // 2. Obtener lista de perfiles para hallar user y estado
      const resAll = await api.get("/perfil");
      const matching = resAll.data.find((p) => String(p.ID_PERFIL) === String(id));

      const usernameVal = matching ? matching.USER : (profileData.correo ? profileData.correo.split("@")[0] : "");
      const estadoVal = matching ? matching.ESTADO : "ACTIVO";

      setFormData({
        id_Perfil: profileData.id_Perfil || "",
        tipoIdentificacion: profileData.tipoIdentificacion || "",
        nombre: profileData.nombre || "",
        apellido: profileData.apellido || "",
        fechaNacimiento: profileData.fechaNacimiento ? profileData.fechaNacimiento.split("T")[0] : "",
        genero: profileData.genero || "",
        correo: profileData.correo || "",
        telefono: profileData.telefono || "",
        password: "",
        confirmPassword: "",
        isAdmin: String(profileData.isAdmin || "1"),
        estado: estadoVal
      });

      setOriginalId(profileData.id_Perfil || "");
      setUrlFoto(profileData.foto || "");
    } catch (err) {
      console.error("Error al obtener datos:", err);
      showNotification("error", "Error", "No se pudo cargar la información del perfil.");
      navigate("/sd/profiles");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const invalidSequences = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"];

    if (name === "tipoIdentificacion") {
      setFormData((prev) => ({
        ...prev,
        tipoIdentificacion: value,
        id_Perfil: "" // Limpia el documento al cambiar tipo
      }));
      return;
    }

    if (name === "id_Perfil") {
      if (invalidSequences.includes(value)) return;
      if (formData.tipoIdentificacion === "Pasaporte") {
        if (!/^[a-zA-Z0-9]*$/.test(value)) return;
        if (value.length > 10) return;
      } else {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 12) return;
      }
    }

    if (name === "telefono") {
      if (invalidSequences.includes(value)) return;
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (name === "nombre" || name === "apellido") {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(file.type)) {
      return showNotification("warning", "Formato no válido", "Por favor, selecciona una imagen en formato JPG o PNG.");
    }

    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePreview = () => {
    setFotoFile(null);
    setFotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validar edad mínima (14 años)
    const today = new Date();
    const birthDate = new Date(formData.fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 14 ||
      (age === 14 && monthDiff < 0) ||
      (age === 14 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      showNotification("error", "Edad inválida", "El usuario debe tener al menos 14 años.");
      setSaving(false);
      return;
    }

    // Validar formato de correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      showNotification("error", "Correo inválido", "Ingrese un correo electrónico válido.");
      setSaving(false);
      return;
    }

    // Validar id_Perfil longitud
    if (formData.id_Perfil.length < 5) {
      showNotification("error", "Id Perfil inválido", "El id Perfil debe tener al menos 5 caracteres.");
      setSaving(false);
      return;
    }

    // Validar teléfono longitud
    if (formData.telefono.length < 5) {
      showNotification("error", "Teléfono inválido", "El número de teléfono debe tener al menos 5 caracteres.");
      setSaving(false);
      return;
    }

    // Validar contraseña si se ingresó alguna
    if (formData.password && formData.password.trim() !== "") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(formData.password)) {
        showNotification(
          "error",
          "Contraseña débil",
          "La contraseña debe tener mínimo 6 caracteres, al menos una mayúscula, una minúscula y un número."
        );
        setSaving(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showNotification("error", "Error de confirmación", "Las contraseñas no coinciden.");
        setSaving(false);
        return;
      }
    }

    try {
      const data = new FormData();
      data.append("id_Perfil", formData.id_Perfil);
      data.append("tipoIdentificacion", formData.tipoIdentificacion);
      data.append("nombre", formData.nombre);
      data.append("apellido", formData.apellido);
      data.append("fechaNacimiento", formData.fechaNacimiento);
      data.append("genero", formData.genero);
      data.append("correo", formData.correo);
      data.append("telefono", formData.telefono);

      if (formData.password && formData.password.trim() !== "") {
        data.append("password", formData.password);
      }

      data.append("isAdmin", formData.isAdmin);
      data.append("estado", formData.estado);
      data.append("idPerfilAccion", current_user_id_perfil);
      data.append("usernameAccion", username);

      if (fotoFile) {
        data.append("foto", fotoFile);
      }

      const response = await api.put(`/perfil/${originalId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (formData.isAdmin == 3) {
        const response2 = await api.put(`/perfil/${formData.id_Perfil}/permissions`, {
          perm_fosil: 1,
          perm_mineral: 1,
          perm_roca: 1,
          perm_investigacion: 1,
          perm_perfil: 1,
          usernameAccion: username
        });

        if (response2.status === 200) {
          showNotification("success", "¡Éxito!", "Perfil actualizado con privilegios de superadministrador.");
        }
      } else if (formData.isAdmin == 2) {
        const response2 = await api.put(`/perfil/${formData.id_Perfil}/permissions`, {
          perm_fosil: 0,
          perm_mineral: 0,
          perm_roca: 0,
          perm_investigacion: 0,
          perm_perfil: 0,
          usernameAccion: username
        });

        if (response2.status === 200) {
          showNotification("success", "¡Éxito!", "Perfil actualizado con privilegios de admin.");
        }
      } else if (formData.isAdmin == 1) {
        const response2 = await api.put(`/perfil/${formData.id_Perfil}/permissions`, {
          perm_fosil: 0,
          perm_mineral: 0,
          perm_roca: 0,
          perm_investigacion: 0,
          perm_perfil: 0,
          usernameAccion: username,
          idPerfilAccion: current_user_id_perfil
        });

        if (response2.status === 200) {
          showNotification("success", "¡Éxito!", "Perfil actualizado con privilegios de usuario.");
        }
      }

      if (response.status === 200) {
        showNotification("success", "¡Éxito!", "Perfil actualizado correctamente.");
        // Si el perfil editado es el del usuario actual, y cambió su foto/nombre, podemos forzar refresco
        if (originalId === current_user_id_perfil) {
          localStorage.setItem("username", formData.user);
          localStorage.setItem("isAdmin", formData.isAdmin);
          // Si el backend retornó nueva url de foto, se actualiza en localStorage
          if (response.data && response.data.foto) {
            localStorage.setItem("urlFotoProfile", response.data.foto);
          }
        }
        navigate(`/perfil/${formData.id_Perfil}`);
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout username={username} setAuth={setAuth}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#785a0a] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#4e4638] font-medium">Cargando datos del perfil...</p>
        </div>
      </PageLayout>
    );
  }

  if (isAuthorized === false) {
    return (
      <PageLayout username={username} setAuth={setAuth}>
        <div className={style.container}>
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-2xl border border-red-100 p-8 shadow-sm text-center">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
            <p className="text-gray-600 max-w-md mb-6">
              No tienes los permisos necesarios para editar perfiles en este sistema. Por favor contacta a un Superadministrador.
            </p>
            <button className={style.btnCancel} onClick={() => navigate("/sd/profiles")}>
              Volver a Perfiles
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const fotoFinal = fotoPreview || (urlFoto
    ? (urlFoto.includes("drive.google.com")
      ? `/api/imagen/load/${urlFoto.split("/d/")[1]?.split("/")[0] || null}`
      : urlFoto)
    : (formData.genero === "Masculino" ? imagenProfileMale : formData.genero === "Femenino" ? imagenProfileFemale : imagenProfileOther));

  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className={style.container}>
        {/* Breadcrumb */}
        <nav className={style.breadcrumb}>
          <Link to="/sd/profiles">Profiles</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/perfil/${id}`}>Detail</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-[#1a1c1c]">Edit</span>
        </nav>

        {/* Card Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={style.card}
        >
          <div className={style.titleSection}>
            <h1 className={style.title}>Editar Perfil</h1>
            <p className={style.subtitle}>Modifica los datos personales y de acceso del usuario seleccionado.</p>
          </div>

          <form onSubmit={handleSubmit} className={style.form}>
            {/* Foto de Perfil */}
            <div className={style.photoSection}>
              <div className={style.avatarWrapper}>
                <img src={fotoFinal} alt="Preview" className={style.avatar} />
              </div>
              <div className={style.photoActions}>
                <label className={style.fileInputLabel}>
                  <Upload className="w-4 h-4" />
                  Seleccionar foto
                  <input type="file" className={style.fileInput} onChange={handleFileChange} accept="image/*" />
                </label>
                {fotoPreview && (
                  <button type="button" className={style.btnCancel} style={{ padding: "6px 12px", fontSize: "12px" }} onClick={handleRemovePreview}>
                    Deshacer
                  </button>
                )}
              </div>
            </div>

            {/* Grid de campos */}
            <div className={style.formGrid}>
              <div className={style.formGroup}>
                <label className={style.label}>Tipo de Identificación</label>
                <select
                  name="tipoIdentificacion"
                  value={formData.tipoIdentificacion}
                  onChange={handleChange}
                  className={style.select}
                  required
                >
                  <option value="" disabled>Seleccione una opción</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad (TI)</option>
                  <option value="Cedula de Ciudadania">Cédula de Ciudadanía (CC)</option>
                  <option value="Tarjeta de extranjeria">Tarjeta de extranjería (TE)</option>
                  <option value="Cedula de extranjeria">Cédula de extranjería (CE)</option>
                  <option value="Pasaporte">Pasaporte (PP)</option>
                  <option value="Permiso especial de permanencia">Permiso especial de permanencia (PEP)</option>
                </select>
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Número de Documento (ID)</label>
                <input
                  type="text"
                  name="id_Perfil"
                  value={formData.id_Perfil}
                  onChange={handleChange}
                  placeholder="Ingrese el número de documento"
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Nombres</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombres"
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Apellidos</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellidos"
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className={style.select}
                  required
                >
                  <option value="" disabled>Seleccione una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={style.input}
                  required
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className={style.input}
                  required
                />
              </div>

              {current_isAdmin === 3 && (
                <div className={style.formGroup}>
                  <label className={style.label}>Rol en el Sistema</label>
                  <select
                    name="isAdmin"
                    value={formData.isAdmin}
                    onChange={handleChange}
                    className={style.select}
                    required
                  >
                    <option value="1">Visitante</option>
                    <option value="2">Administrador</option>
                    <option value="3">SuperAdministrador</option>
                  </select>
                </div>
              )}
              <div className={style.formGroup}>
                <label className={style.label}>Estado de la Cuenta</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={style.select}
                  required
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="BLOQUEADO">BLOQUEADO</option>
                </select>
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Cambiar Contraseña (Opcional)</label>
                <div className={style.passwordWrapper}>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nueva contraseña"
                    className={style.input}
                  />
                  <button type="button" className={style.togglePass} onClick={() => togglePasswordVisibility("new")}>
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Confirmar Contraseña</label>
                <div className={style.passwordWrapper}>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repita la contraseña"
                    className={style.input}
                  />
                  <button type="button" className={style.togglePass} onClick={() => togglePasswordVisibility("confirm")}>
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {formData.confirmPassword && (
                    <div className={style.validationIcon}>
                      {passwordsMatch ? (
                        <CheckCircle size={18} className={style.iconSuccess} />
                      ) : (
                        <XCircle size={18} className={style.iconError} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className={style.buttonsRow}>
              <button type="button" className={style.btnCancel} onClick={() => navigate(`/perfil/${id}`)} disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className={style.btnSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default EditProfile;
