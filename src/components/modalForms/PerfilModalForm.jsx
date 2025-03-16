import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';

const PerfilModalForm = ({ isOpen, closeModal, onSave, perfilData }) => {
    const [formData, setFormData] = useState({ ...perfilData });

    useEffect(() => {
        if (perfilData) {
            setFormData({
                ...perfilData,
                fechaNacimiento: perfilData.fechaNacimiento 
                    ? new Date(perfilData.fechaNacimiento).toISOString().split("T")[0] 
                    : ""
            });
        }
    }, [perfilData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            fechaNacimiento: formData.fechaNacimiento 
                ? new Date(formData.fechaNacimiento).toISOString()  // Convierte a formato ISO
                : null
        };
    
        onSave(formattedData);  // Enviar los datos convertidos
        closeModal();
    };

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className="modal-form" onClick={closeModal}>
                <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
                    <span className="close-form" onClick={closeModal}>
                        &times;
                    </span>
                    <h3>Editar Perfil</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nombre:
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </label>
                        <label>
                            Apellido:
                            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                        </label>
                        <label>
                            Fecha de Nacimiento:
                            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
                        </label>
                        <label>
                            Género:
                            <select className="styled-select" name="genero" value={formData.genero} onChange={handleChange} required>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </label>
                        <label>
                            Correo:
                            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                        </label>
                        <label>
                            Teléfono:
                            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
                        </label>
                        <button type="submit" className="save-button">Guardar</button>
                    </form>
                </div>
            </div>
        )
    );
};

export default PerfilModalForm;