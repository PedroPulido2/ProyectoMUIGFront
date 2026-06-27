import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableComponent from "../components/TableComponent";
import MineralFormModal from "../components/modalForms/MineralModalForm";
import api from '../services/api';
import { showNotification, showConfirmation } from "../utils/showNotification";

const Mineral = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const current_isAdmin = Number(localStorage.getItem("isAdmin")) || 0;
  const perm_mineral = Number(localStorage.getItem("perm_mineral")) || 0;

  const canManage = current_isAdmin === 3 || (current_isAdmin === 2 && perm_mineral === 1);

  const [minerales, setMinerales] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentMineral, setCurrentMineral] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("ID_MINERAL");

  const idPerfilAccion = localStorage.getItem("id_Perfil") || "";
  const usernameAccion = localStorage.getItem("username") || "";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, selectedColumn, searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedColumn]);

  useEffect(() => {
    document.title = "Gestion Minerales";
    if (currentPage !== 1) {
      fetchData(currentPage);
    }
  }, [currentPage]);

  //Funcion crear
  const handleCreate = () => {
    setCurrentMineral(null);
    setIsFormModalOpen(true);
  };

  //Funcion actualizar
  const handleUpdate = (row) => {
    setCurrentMineral(row);
    setIsFormModalOpen(true);
  };

  //---Peticiones al Backend---
  //Petición obtener los datos
  const fetchData = async (page = 1, searchCol = selectedColumn, searchVal = searchTerm) => {
    try {
      const response = await api.get(`/mineral?page=${page}&limit=${limit}&searchColumn=${searchCol}&searchTerm=${searchVal}`);

      setMinerales(response.data.data);
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

      if (currentMineral) {
        await api.put(`/mineral/${currentMineral.ID_MINERAL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "Mineral Actualizado", `El mineral con ID: ${currentMineral.ID_MINERAL} ha sido actualizado.`);
      } else {
        await api.post(`/mineral`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "¡Mineral Añadido!", "Nuevo mineral añadido exitosamente.");
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
    }
  };

  //Petición para eliminar los datos
  const handleDelete = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `El mineral con ID: ${row.ID_MINERAL} será eliminado.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/mineral/${row.ID_MINERAL}`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "Eliminado", `El mineral con ID: ${row.ID_MINERAL} ha sido eliminado.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  //Petición para eliminar la imagen
  const handleDeleteImage = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `Se eliminará la imagen del mineral con ID: ${row.ID_MINERAL}.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/mineral/${row.ID_MINERAL}/image`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "Imagen Eliminada", `La imagen del mineral con ID: ${row.ID_MINERAL} ha sido eliminada.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  const allColumns = [
    "ID_MINERAL",
    "N_BARRANTES",
    "COLECCION",
    "NOMBRE_MINERAL",
    "CANTIDAD",
    "GRUPO_MINERALOGICO",
    "REGION",
    "SUBGRUPO",
    "COMPOSICION",
    "CARACTERISTICAS",
    "COLECTOR",
    "OBSERVACIONES",
    "UBICACION",
    "FOTO",
  ];

  //Arreglo de columnas a visualizar en la pagina
  const columns = [
    "ID_MINERAL",
    "COLECCION",
    "NOMBRE_MINERAL",
    "GRUPO_MINERALOGICO",
    "REGION",
    "CARACTERISTICAS",
    "UBICACION",
    "FOTO",
  ];

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Gestión de Minerales</h2>
        <TableComponent
          allColumns={allColumns}
          columns={columns}
          data={minerales}
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
      <MineralFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        mineralData={currentMineral}
        onSave={handleSaveUpdate}
      />
    </PageLayout>
  );
};

export default Mineral;