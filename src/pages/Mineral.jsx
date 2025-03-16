import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Main.css'
import TableComponent from "../components/TableComponent";
import MineralFormModal from "../components/modalForms/MineralModalForm";
import api from '../services/api';

const Mineral = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [minerales, setMinerales] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentMineral, setCurrentMineral] = useState(null);

  useEffect(() => {
    document.title = "Gestion Minerales";
    fetchData();
  }, []);

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
  const fetchData = async () => {
    try {
      const response = await api.get("/mineral");
      setMinerales(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        setError('Ocurrió un error inesperado. Intente nuevamente.');
      }
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

      if (currentMineral) {
        await api.put(`/mineral/${currentMineral.ID_MINERAL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert(`El mineral con ID: ${currentMineral.ID_MINERAL} ha sido actualizado.`);
      } else {
        await api.post(`/mineral`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Nuevo mineral añadido exitosamente.");
      }
      setIsFormModalOpen(false);
      fetchData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        setError('Ocurrió un error inesperado. Intente nuevamente.');
      }
    }
  };

  //Petición para eliminar los datos
  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el mineral con ID: ${row.ID_MINERAL}?`)) {
      try {
        await api.delete(`/mineral/${row.ID_MINERAL}`);
        alert(`El mineral con ID: ${row.ID_MINERAL} ha sido eliminado.`);
        fetchData();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          setError('Ocurrió un error inesperado. Intente nuevamente.');
        }
      }
    }
  };

  //Petición para eliminar la imagen
  const handleDeleteImage = async (row) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la imagen del mineral con ID: ${row.ID_MINERAL}?`)) {
      try {
        await api.delete(`/mineral/${row.ID_MINERAL}/image`);
        alert(`La imagen del mineral con ID: ${row.ID_MINERAL} ha sido eliminado.`);
        fetchData();
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          alert(err.response.data.error);
        } else {
          setError('Ocurrió un error inesperado. Intente nuevamente.');
        }
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