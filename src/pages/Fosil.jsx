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

  const fetchData = async () => {
    try {
      const response = await api.get("/fosil");
      setFosiles(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de fosiles", error);
    }
  };

  useEffect(() => {
    document.title = "Gestion Fosiles";
    fetchData();
  }, []);

  const handleCreate = () => {
    setCurrentFosil(null);
    setIsFormModalOpen(true);
  };

  const handleUpdate = (row) => {
    setCurrentFosil(row);
    setIsFormModalOpen(true);
  };

  const handleSave = async (data) => {
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
    } catch (error) {
      console.error("Error al guardar el fosil", error);
      alert("Error al Guardar el fósil", error);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el fósil con ID: ${row.ID_FOSIL}?`)) {
      try {
        await api.delete(`/fosil/${row.ID_FOSIL}`);
        alert(`El fósil con ID: ${row.ID_FOSIL} ha sido eliminado.`);
        fetchData();
      } catch (error) {
        console.error("Error al eliminar el fósil", error);
        alert("Error al eliminar el fósil.");
      }
    }
  };

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
          onDelete={handleDelete}
        />
      </div>

      <FosilFormModal
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        fosilData={currentFosil}
        onSave={handleSave}
      />
    </PageLayout>
  );
};

export default Fosil;