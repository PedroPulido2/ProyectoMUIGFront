import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableComponent from "../components/TableComponent";
import RocaFormModal from "../components/modalForms/RocaModalForm";
import api from '../services/api';
import { showNotification, showConfirmation } from "../utils/showNotification";

const Roca = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const current_isAdmin = Number(localStorage.getItem("isAdmin")) || 0;
  const perm_roca = Number(localStorage.getItem("perm_roca")) || 0;

  const canManage = current_isAdmin === 3 || (current_isAdmin === 2 && perm_roca === 1);

  const [rocas, setRocas] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentRocas, setCurrentRocas] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("ID_ROCA");

  const idPerfilAccion = localStorage.getItem("id_Perfil") || "";
  const usernameAccion = localStorage.getItem("username") || "";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, selectedColumn, searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedColumn]);

  useEffect(() => {
    document.title = "Gestion Rocas";
    if (currentPage !== 1) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  //Funcion crear
  const handleCreate = () => {
    setCurrentRocas(null);
    setIsFormModalOpen(true);
  };

  //Funcion actualizar
  const handleUpdate = (row) => {
    setCurrentRocas(row);
    setIsFormModalOpen(true);
  };

  //---Peticiones al Backend---
  //Petición obtener los datos
  const fetchData = async (page = 1, searchCol = selectedColumn, searchVal = searchTerm) => {
    try {
      const response = await api.get(`/roca?page=${page}&limit=${limit}&searchColumn=${searchCol}&searchTerm=${searchVal}`);

      setRocas(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      showNotification("error", "Error al obtener los datos!", err.response?.data?.error || "Ocurrió un error inesperado.");
    }
  };

  //Petición actualizar u añadir los datos
  const handleSaveUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      formData.append("idPerfilAccion", idPerfilAccion);
      formData.append("usernameAccion", usernameAccion);

      if (currentRocas) {
        await api.put(`/roca/${currentRocas.ID_ROCA}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "Roca Actualizada", `La roca con ID: ${currentRocas.ID_ROCA} ha sido actualizada.`);
      } else {
        await api.post(`/roca`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "¡Roca Añadida!", "Nueva roca añadida exitosamente.");
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
    }
  };

  //Petición para eliminar los datos
  const handleDelete = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `Se eliminará la roca con ID: ${row.ID_ROCA}. Esta acción no se puede deshacer.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/roca/${row.ID_ROCA}`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "Eliminado", `La roca con ID: ${row.ID_ROCA} ha sido eliminada.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  //Petición para eliminar la imagen
  const handleDeleteImage = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `Se eliminará la imagen de la roca con ID: ${row.ID_ROCA}. Esta acción no se puede deshacer.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/roca/${row.ID_ROCA}/image`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "Eliminado", `La imagen de la roca con ID: ${row.ID_ROCA} ha sido eliminada.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  const allColums = [
    "ID_ROCA",
    "N_BARRANTES",
    "OTROS",
    "BD_C_VARGAS",
    "TIPO",
    "COLECCION",
    "NOMBRE_PIEZA",
    "DEPARTAMENTO",
    "MUNICIPIO",
    "COLECTOR_DONADOR",
    "CARACTERISTICAS",
    "OBSERVACIONES",
    "UBICACION",
    "FOTO",
  ];

  //Arreglo de columnas a visualizar en la pagina
  const columns = [
    "ID_ROCA",
    "TIPO",
    "COLECCION",
    "NOMBRE_PIEZA",
    "DEPARTAMENTO",
    "MUNICIPIO",
    "OBSERVACIONES",
    "UBICACION",
    "FOTO",
  ];

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Gestión de Rocas</h2>
        <TableComponent
          allColumns={allColums}
          columns={columns}
          data={rocas}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeleteImage={handleDeleteImage}
          onDelete={handleDelete}
          canManage={canManage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          searchTerm={searchTerm}
          onSearchChange={(val) => setSearchTerm(val)}
          selectedColumn={selectedColumn}
          onColumnChange={(val) => setSelectedColumn(val)}
        />
      </div>
      <RocaFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        rocaData={currentRocas}
        onSave={handleSaveUpdate}
      />
    </PageLayout>
  );
};

export default Roca;