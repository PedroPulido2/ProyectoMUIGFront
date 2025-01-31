import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Fosil.css'
import TableComponent from "../components/TableComponent";
import FosilFormModal from "../components/FosilModalForm";
import api from '../services/api';

const Fosil = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [fosiles, setFosiles] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentFosil, setCurrentFosil] = useState(null);

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

      if (currentFosil) {
        await api.put(`/fosil/${currentFosil.ID_FOSIL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert(`El fósil con ID: ${currentFosil.ID_FOSIL} ha sido actualizado.`);
      } else {
        await api.post(`/fosil`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Nuevo fosil añadido exitosamente.");
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar el fósil con ID: ${row.ID_FOSIL}?`)) {
      try {
        await api.delete(`/fosil/${row.ID_FOSIL}`);
        alert(`El fósil con ID: ${row.ID_FOSIL} ha sido eliminado.`);
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar la imagen del fósil con ID: ${row.ID_FOSIL}?`)) {
      try {
        await api.delete(`/fosil/${row.ID_FOSIL}/image`);
        alert(`La imagen del fósil con ID: ${row.ID_FOSIL} ha sido eliminado.`);
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