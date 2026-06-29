import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, X } from "lucide-react";
import PageLayout from "../components/PageLayout";
import TableComponent from "../components/TableComponent";
import api from "../services/api";
import { showNotification, showConfirmation } from "../utils/showNotification";

import style from "../styles/Modulos.module.css";
import modalStyle from "../styles/FormModal.module.css";

const ModuloDataView = ({ setAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Invitado";
  const id_Perfil = localStorage.getItem("id_Perfil") || 0;
  const isAdmin = Number(localStorage.getItem("isAdmin")) || 0;

  // Para modularización de permisos: permitimos que Admins y SuperAdmins gestionen los datos
  const canManage = isAdmin === 3 || isAdmin === 2;

  const [moduleMeta, setModuleMeta] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("id");

  // Modal states for CRUD records
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordData, setRecordData] = useState({});

  useEffect(() => {
    fetchModuleMetaAndData();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (moduleMeta) {
      fetchData(1, selectedColumn, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, selectedColumn, moduleMeta]);

  useEffect(() => {
    if (currentPage !== 1) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  const fetchModuleMetaAndData = async () => {
    setLoading(true);
    try {
      let meta = null;
      try {
        const resMeta = await api.get(`/custom-modulo/${id}`);
        meta = resMeta.data;
      } catch (err) {
        showNotification("error", "Error", "Error al cargar metadatos desde backend.");
      }

      if (!meta) {
        showNotification("error", "Error", "El módulo solicitado no existe.");
        navigate("/modulos");
        return;
      }

      setModuleMeta(meta);
      document.title = `Datos de ${meta.nombre}`;

      if (meta.columnas && meta.columnas.length > 0) {
        setSelectedColumn(meta.columnas[0]);
      }

    } catch (err) {
      showNotification("error", "Error", "No se pudo iniciar el módulo.");
    }
  };

  const fetchData = async (page = 1, searchCol = selectedColumn, searchVal = debouncedSearchTerm) => {
    if (!moduleMeta) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/custom-modulo/${id}/data?page=${page}&limit=${limit}&searchColumn=${searchCol}&searchTerm=${searchVal}`
      );
      setRecords(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      showNotification("error", "Error", "Error al cargar los registros.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = () => {
    setCurrentRecord(null);
    const initial = {};
    moduleMeta.columnas.forEach((col) => {
      initial[col] = "";
    });
    setRecordData(initial);
    setIsRecordModalOpen(true);
  };

  const handleUpdateRecord = (row) => {
    setCurrentRecord(row);
    setRecordData({ ...row });
    setIsRecordModalOpen(true);
  };

  const handleDeleteRecord = async (row) => {
    const confirm = await showConfirmation(
      "¿Está seguro?",
      "Esta acción eliminará de forma permanente este registro."
    );
    if (!confirm.isConfirmed) return;

    try {
      const config = {
        data: {
          usernameAccion: username,
          idPerfilAccion: id_Perfil,
        }
      };
      await api.delete(`/custom-modulo/${id}/data/${row.id}`, config);

      showNotification("success", "Eliminado", "Registro eliminado correctamente.");
      fetchData(currentPage);
    } catch (err) {
      showNotification("error", "Error", "Error al eliminar el registro.");
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = { ...recordData };
      dataToSend.usernameAccion = username;
      dataToSend.idPerfilAccion = id_Perfil;

      if (currentRecord) {
        await api.put(`/custom-modulo/${id}/data/${currentRecord.id}`, dataToSend);
        showNotification("success", "Actualizado", "Registro actualizado correctamente.");
      } else {
        delete dataToSend.id;

        await api.post(`/custom-modulo/${id}/data`, dataToSend);
        showNotification("success", "Creado", "Registro guardado correctamente.");
      }
      setIsRecordModalOpen(false);
      fetchData(currentPage);
    } catch (err) {
      showNotification("error", "Error", "Error al guardar el registro.");
    }
  };

  const handleInputChange = (colName, value) => {
    setRecordData({
      ...recordData,
      [colName]: value
    });
  };

  if (loading || !moduleMeta) {
    return (
      <PageLayout username={username} setAuth={setAuth}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#785a0a] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#4e4638] font-medium">Cargando datos del módulo...</p>
        </div>
      </PageLayout>
    );
  }

  // Filtrar columnas para no mandar 'id' a editar (el ID se gestiona automáticamente)
  const editableColumns = moduleMeta.columnas.filter((col) => col.toLowerCase() !== "id");

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className={style.viewContainer}>
        {/* Breadcrumb */}
        <div className={style.backRow}>
          <Link to="/modulos">
            <span className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Volver a Módulos
            </span>
          </Link>
          <ChevronRight className="w-4 h-4 text-[#8c8577]" />
          <span className="font-semibold text-[#1a1c1c]">{moduleMeta.nombre}</span>
        </div>

        {/* Tabla Dinámica */}
        <TableComponent
          allColumns={moduleMeta.columnas}
          columns={moduleMeta.columnas}
          data={records}
          onCreate={handleCreateRecord}
          onUpdate={handleUpdateRecord}
          onDelete={handleDeleteRecord}
          canManage={canManage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          searchTerm={searchTerm}
          onSearchChange={(val) => setSearchTerm(val)}
          selectedColumn={selectedColumn}
          onColumnChange={(val) => setSelectedColumn(val)}
          enableExport={true}
        />

        {/* Modal de Creación / Edición de Registros */}
        {isRecordModalOpen && (
          <div className={modalStyle.modalForm} onClick={() => setIsRecordModalOpen(false)}>
            <div
              className={modalStyle.modalContentForm}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={modalStyle.closeForm}
                onClick={() => setIsRecordModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <h3>{currentRecord ? `Editar Registro` : `Crear Registro en ${moduleMeta.nombre}`}</h3>

              <form onSubmit={handleSaveRecord}>
                {editableColumns.map((col) => (
                  <div key={col} className={modalStyle.formGroup}>
                    <label>{col}</label>
                    <input
                      type="text"
                      value={recordData[col] || ""}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      placeholder={`Ingrese ${col}`}
                      required
                    />
                  </div>
                ))}

                <button type="submit" className={modalStyle.saveButton}>
                  {currentRecord ? "Actualizar Registro" : "Guardar Registro"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ModuloDataView;
