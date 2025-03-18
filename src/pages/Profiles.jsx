import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";
import '../styles/Main.css'
import TableComponent from "../components/TableComponent";
import ProfilesModalForm from "../components/modalForms/ProfilesModalForm";

const Profiles = ({ setAuth }) => {
  const username = localStorage.getItem("username") || "Invitado";

  const [profiles, setProfiles] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  useEffect(() => {
    document.title = "Gestión de Perfiles";
    fetchData();
  }, []);

  
  //Peticiones al Backend, para obtener los datos
  const fetchData = async () => {
    try {
      const response = await api.get("/perfil");

      // Filtrar los perfiles para excluir el del usuario actual
    const filteredProfiles = response.data.filter(profile => profile.USER !== username);

      // Transformar los datos agregando la propiedad "ROL"
      const formattedProfiles = filteredProfiles.map(profile => ({
        ...profile,
        ROL: profile.IS_ADMIN === 1 ? "Visitante" :
          profile.IS_ADMIN === 2 ? "Administrador" :
            "Super-Administrador",

        FECHA_NACIMIENTO: profile.FECHA_NACIMIENTO
          ? new Date(profile.FECHA_NACIMIENTO).toISOString().split("T")[0]
          : "",

        FECHA_CREACION: profile.FECHA_CREACION
          ? new Date(profile.FECHA_CREACION).toISOString().split("T")[0]
          : ""
      }));

      setProfiles(formattedProfiles);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        setError('Ocurrió un error inesperado. Intente nuevamente.');
      }
    }
  }

  //Funcion Crear
  const handleCreate = () => {
    setCurrentProfile(null);
    setIsFormModalOpen(true);
  };

  //Funcion actualizar
  const handleUpdate = (row) => {
    setCurrentProfile(row);
    setIsFormModalOpen(true);
  };

  const handleSaveUpdate = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key]) {
          formData.append(key, data[key]);
        }
      });

      console.log(data);
      console.log(currentProfile);

      if (currentProfile) {
        await api.put(`/perfil/${currentProfile.ID_PERFIL}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert(`El perfil con ID: ${currentProfile.ID_PERFIL} ha sido actualizado.`);
      } else {
        await api.post(`/perfil`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Nuevo Perfil añadido exitosamente");
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

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro que quiere eliminar el perfil con ID: ${row.ID_PERFIL}?`)){
      try {
        await api.delete(`/perfil/${row.ID_PERFIL}`);
        alert(`El perfil con ID: ${row.ID_PERFIL} ha sido eliminado.`);
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

  const handleDeleteImage = async (row) => {
    if (window.confirm(`¿Estás seguro que quiere eliminar la imagen del perfil con ID: ${row.ID_PERFIL}?`)){
      try {
        await api.delete(`/perfil/${row.ID_PERFIL}/image`);
        alert(`La imagen del perfil con ID: ${row.ID_PERFIL} ha sido eliminado.`);
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
    "ID_PERFIL",
    "USER",
    "TIPO_IDENTIFICACION",
    "NOMBRE",
    "APELLIDO",
    "FECHA_NACIMIENTO",
    "GENERO",
    "CORREO",
    "TELEFONO",
    "FOTO",
    "FECHA_CREACION",
    "ROL",
  ];

  const columns = [
    "ID_PERFIL",
    "USER",
    "TIPO_IDENTIFICACION",
    "NOMBRE",
    "APELLIDO",
    "FECHA_NACIMIENTO",
    "GENERO",
    "CORREO",
    "TELEFONO",
    "FOTO",
    "ROL",
  ];


  return (
    <PageLayout username={username} setAuth={setAuth}>
      <div className="main">
        <h2>Configuración Perfiles</h2>
        <TableComponent
          allColumns={allColumns}
          columns={columns}
          data={profiles}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDeleteImage={handleDeleteImage}
          onDelete={handleDelete}
        />
      </div>
      <ProfilesModalForm
        isOpen={isFormModalOpen}
        closeModal={() => setIsFormModalOpen(false)}
        profileData={currentProfile}
        onSave={handleSaveUpdate}
      />
    </PageLayout>
  );
};

export default Profiles;