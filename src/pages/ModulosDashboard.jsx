import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, ArrowRight, X } from "lucide-react";
import { motion } from "motion/react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import { showNotification, showConfirmation } from "../utils/showNotification";

import style from "../styles/Modulos.module.css";
import modalStyle from "../styles/FormModal.module.css";

const ModulosDashboard = ({ setAuth }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Invitado";
  const id_Perfil = Number(localStorage.getItem("id_Perfil")) || 0;
  const isAdmin = Number(localStorage.getItem("isAdmin")) || 0;

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newModuleName, setNewModuleName] = useState("");
  const [columns, setColumns] = useState([]);
  const [curColumnName, setCurColumnName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Módulos Personalizados";
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await api.get("/custom-modulo");
      setModules(response.data);
    } catch (err) {
      console.warn("Error al obtener módulos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!curColumnName.trim()) return;

    // Normalizar nombres de columnas para que no tengan caracteres extraños que rompan JSON
    const normalized = curColumnName.trim();
    if (columns.includes(normalized) || normalized.toLowerCase() === "id") {
      showNotification("warning", "Duplicado", "La columna ya existe o es reservada.");
      return;
    }

    setColumns([...columns, normalized]);
    setCurColumnName("");
  };

  const handleRemoveColumn = (colName) => {
    setColumns(columns.filter((c) => c !== colName));
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newModuleName.trim()) {
      showNotification("error", "Error", "El nombre del módulo es requerido.");
      return;
    }
    if (columns.length === 0) {
      showNotification("error", "Error", "Debe agregar al menos una columna.");
      return;
    }

    setSaving(true);
    const finalColumns = ["id", ...columns];
    const modulePayload = {
      nombre: newModuleName.trim(),
      columnas: finalColumns,
      usernameAccion: username,
      idPerfilAccion: id_Perfil
    };

    try {
      const response = await api.post("/custom-modulo", modulePayload);
      if (response.status === 201) {
        showNotification("success", "¡Éxito!", `Módulo "${newModuleName}" creado.`);
        fetchModules();
        closeModal();
      }
    } catch (err) {
      console.warn("No se pudo guardar en backend.");
    }
  };

  const handleDeleteModule = async (e, mod) => {
    e.stopPropagation(); // Evita navegar al hacer clic en el botón de borrar
    const confirm = await showConfirmation(
      "¿Está seguro?",
      `Esto eliminará permanentemente el módulo "${mod.nombre}" y todos sus registros.`
    );
    if (!confirm.isConfirmed) return;

    try {
      const config = {
        data: {
          usernameAccion: username,
          idPerfilAccion: id_Perfil,
        }
      };

      await api.delete(`/custom-modulo/${mod.id}`, config);
      showNotification("success", "¡Eliminado!", "Módulo eliminado correctamente.");
      fetchModules();
    } catch (err) {
      console.warn("Error al borrar en backend.");
    }
  };

  const openModal = () => {
    setNewModuleName("");
    setColumns([]);
    setCurColumnName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className={style.container}>
        {/* Encabezado */}
        <div className={style.header}>
          <h1 className={style.title}>Módulos Personalizados</h1>
          <p className={style.subtitle}>
            Visualiza y administra las colecciones y catálogos creados dinámicamente.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-12 h-12 border-4 border-[#785a0a] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#4e4638] font-medium">Cargando módulos...</p>
          </div>
        ) : (
          <div className={style.grid}>
            {/* Tarjeta de creación de módulo para Superadministrador */}
            {isAdmin === 3 && (
              <div className={style.cardCreate} onClick={openModal}>
                <div className={style.createIcon}>
                  <Plus className="w-6 h-6 text-[#785a0a]" />
                </div>
                <span className={style.createLabel}>Crear Nuevo Módulo</span>
              </div>
            )}

            {/* Módulos en cajitas */}
            {modules.map((mod) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={style.card}
                onClick={() => navigate(`/modulos/${mod.id}`)}
              >
                <div>
                  <h3 className={style.cardTitle}>{mod.nombre}</h3>
                  <div className={style.cardMeta}>
                    <span className={style.cardCount}>
                      {mod.columnas.length - 1} campos de información
                    </span>
                    <span className={style.cardDate}>Creado: {mod.fechaCreacion}</span>
                  </div>
                </div>

                <div className={style.cardActions}>
                  <button className={style.btnView}>
                    Ingresar Datos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {isAdmin === 3 && (
                    <button
                      className={style.btnDelete}
                      onClick={(e) => handleDeleteModule(e, mod)}
                      title="Eliminar módulo"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal de creación de módulo */}
        {isModalOpen && (
          <div className={modalStyle.modalForm} onClick={closeModal}>
            <div
              className={modalStyle.modalContentForm}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "520px" }}
            >
              <button className={modalStyle.closeForm} onClick={closeModal}>
                <X className="w-5 h-5" />
              </button>
              <h3>Nuevo Módulo Dinámico</h3>

              <form onSubmit={handleCreateModule}>
                <div className={modalStyle.formGroup}>
                  <label>Nombre del Módulo</label>
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="Ej. Meteoritos, Paleobotánica"
                    required
                  />
                </div>

                <div className={modalStyle.formGroup}>
                  <label>Agregar Campos / Columnas</label>
                  <div className={style.columnsBuilder}>
                    <div className={style.builderInputRow}>
                      <input
                        type="text"
                        value={curColumnName}
                        onChange={(e) => setCurColumnName(e.target.value)}
                        placeholder="Nombre de la columna (Ej. Peso, Origen)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddColumn(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={style.btnAddColumn}
                        onClick={handleAddColumn}
                      >
                        Añadir
                      </button>
                    </div>

                    <div className={style.columnsList}>
                      {/* El ID se auto-agrega */}
                      <span className={style.columnTag} style={{ opacity: 0.7 }}>
                        id (Clave Primaria)
                      </span>
                      {columns.map((col) => (
                        <span key={col} className={style.columnTag}>
                          {col}
                          <button
                            type="button"
                            className={style.btnRemoveColumn}
                            onClick={() => handleRemoveColumn(col)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={modalStyle.saveButton}
                  style={{ marginTop: "16px" }}
                  disabled={saving}
                >
                  {saving ? "Creando..." : "Crear Módulo"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ModulosDashboard;
