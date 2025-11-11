import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Main.css'
import TableComponent from "../components/TableComponent";
import FosilFormModal from "../components/modalForms/FosilModalForm";
import api from '../services/api';
import { showNotification, showConfirmation } from "../utils/showNotification";

const Fosil = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [fosiles, setFosiles] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentFosil, setCurrentFosil] = useState(null);

  const idPerfilAccion = localStorage.getItem("id_Perfil") || "";
  const usernameAccion = localStorage.getItem("username") || "";

  useEffect(() => {
    document.title = "Gestion Fosiles";
    fetchData();
  }, []);

  //Funcion crear
  const handleCreate = () => {
    setCurrentFosil(null);
    setIsFormModalOpen(true);
  };

  //Funcion actualizar
  const handleUpdate = (row) => {
    setCurrentFosil(row);
    setIsFormModalOpen(true);
  };

  //---Peticiones al Backend---
  //Petición obtener los datos
  const fetchData = async () => {
    try {
      const response = await api.get("/fosil");
      setFosiles(response.data);
    } catch (err) {
      showNotification("error", "Error al obtener los datos!", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
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

      if (currentFosil) {
        await api.put(`/fosil/${currentFosil.ID_FOSIL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "Fósil Actualizado", `El fósil con ID: ${currentFosil.ID_FOSIL} ha sido actualizado exitosamente.`);
      } else {
        await api.post(`/fosil`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        showNotification("success", "¡Fósil Añadido!", "Nuevo fósil añadido exitosamente.");
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
    }
  };

  //Petición para eliminar los datos
  const handleDelete = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `Se eliminará el fósil con ID: ${row.ID_FOSIL}. Esta acción no se puede deshacer.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/fosil/${row.ID_FOSIL}`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "¡Eliminado!", `El fósil con ID: ${row.ID_FOSIL} ha sido eliminado.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  //Petición para eliminar la imagen
  const handleDeleteImage = async (row) => {
    const confirmDelete = await showConfirmation("¿Está seguro?", `Se eliminará la imagen del fósil con ID: ${row.ID_FOSIL}. Esta acción no se puede deshacer.`);

    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/fosil/${row.ID_FOSIL}/image`, {
          data: {
            idPerfilAccion: idPerfilAccion,
            usernameAccion: usernameAccion,
          }, headers: {
            "Content-Type": "application/json",
          }
        });
        showNotification("success", "¡Imagen eliminada!", `La imagen del fósil con ID: ${row.ID_FOSIL} ha sido eliminada.`);
        fetchData();
      } catch (err) {
        showNotification("error", "Error", err.response?.data?.error || "Ocurrió un error inesperado. Intente nuevamente.");
      }
    }
  };

  const allColumns = [
    "ID_FOSIL",
    "N_BARRANTES",
    "COLECCION",
    "UBICACION",
    "FILO",
    "SUBFILO",
    "CLASE",
    "ORDEN",
    "FAMILIA",
    "GENERO",
    "NOMBRE_FOSIL",
    "PARTES",
    "TIEMPO_GEOLOGICO",
    "COLECTOR",
    "LOCALIDAD",
    "VITRINA",
    "BANDEJA",
    "OBSERVACIONES",
  ];

  //Arreglo de columnas a visualizar en la pagina
  const columns = [
    "ID_FOSIL",
    "COLECCION",
    "FILO",
    "CLASE",
    "NOMBRE_FOSIL",
    "COLECTOR",
    "LOCALIDAD",
    "VITRINA",
    "BANDEJA",
    "FOTO",
  ];

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Gestión de Fósiles</h2>
        <TableComponent
          allColumns={allColumns}
          columns={columns}
          data={fosiles}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeleteImage={handleDeleteImage}
          onDelete={handleDelete}
        />
      </div>
      <FosilFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        fosilData={currentFosil}
        onSave={handleSaveUpdate}
      />
    </PageLayout>
  );
};

export default Fosil;