import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import '../styles/Main.css'
import TableComponent from "../components/TableComponent";
import InvestigacionFormModal from "../components/modalForms/InvestigacionModalForm";
import api from '../services/api';

const Investigacion = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [investigacion, setInvestigacion] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentInvestigacion, setCurrentInvestigacion] = useState(null);

  useEffect(() => {
    document.title = "Gestion Investigación";
    fetchData();
  }, []);

  //Funcion crear
  const handleCreate = () => {
    setCurrentInvestigacion(null);
    setIsFormModalOpen(true);
  };

  //Funcion actualizar
  const handleUpdate = (row) => {
    setCurrentInvestigacion(row);
    setIsFormModalOpen(true);
  };

  //---Peticiones al Backend---
  //Petición obtener los datos
  const fetchData = async () => {
    try {
      const response = await api.get("/investigacion");
      setInvestigacion(response.data);
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

      if (currentInvestigacion) {
        await api.put(`/investigacion/${currentInvestigacion.ID_PIEZA}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert(`La investigación con ID: ${currentInvestigacion.ID_PIEZA} ha sido actualizado.`);
      } else {
        await api.post(`/investigacion`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Nueva investigación añadido exitosamente.");
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar la investigación con ID: ${row.ID_PIEZA}?`)) {
      try {
        await api.delete(`/investigacion/${row.ID_PIEZA}`);
        alert(`La investigación con ID: ${row.ID_PIEZA} ha sido eliminado.`);
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar la imagen de la investigación con ID: ${row.ID_PIEZA}?`)) {
      try {
        await api.delete(`/investigacion/${row.ID_PIEZA}/image`);
        alert(`La imagen de la investigación con ID: ${row.ID_PIEZA} ha sido eliminado.`);
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
    "ID_PIEZA",
    "COLECCION",
    "REPOSITORIO",
    "FILO",
    "SUBFILO",
    "CLASE",
    "ORDEN",
    "FAMILIA",
    "GENERO",
    "NOMBRE",
    "PERIODO_GEOLOGICO",
    "ERA_GEOLOGICA",
    "FORMACION_GEOLOGICA",
    "SECCION_ESTRATIGRAFICA",
    "COLECTOR",
    "LOCALIDAD",
    "OBSERVACIONES",
    "FOTO",
  ];

  //Arreglo de columnas a visualizar en la pagina
  const columns = [
    "ID_PIEZA",
    "REPOSITORIO",
    "FILO",
    "GENERO",
    "NOMBRE",
    "PERIODO_GEOLOGICO",
    "COLECTOR",
    "LOCALIDAD",
    "FOTO",
  ];

  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Gestión de investigación</h2>
        <TableComponent
          allColumns={allColumns}
          columns={columns}
          data={investigacion}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeleteImage={handleDeleteImage}
          onDelete={handleDelete}
        />
      </div>
      <InvestigacionFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        investigacionData={currentInvestigacion}
        onSave={handleSaveUpdate}
      />
    </PageLayout>
  );
};

export default Investigacion;