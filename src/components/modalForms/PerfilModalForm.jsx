import React, { useEffect, useState } from "react";
import { showNotification } from "../../utils/showNotification";
import '../../styles/FormModal.css';

const PerfilModalForm = ({ isOpen, closeModal, onSave, perfilData }) => {
    const [formData, setFormData] = useState({ ...perfilData });

    useEffect(() => {
        if (perfilData) {
            setFormData({
                ...perfilData,
                fechaNacimiento: perfilData.fechaNacimiento
                    ? perfilData.fechaNacimiento.split("T")[0]
                    : ""
            });
        }
    }, [perfilData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const invalidSequences = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999"];
        if (name === "nombre" || name === "apellido") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
        }

        if (name === "telefono") {
            if (invalidSequences.includes(value)) return;
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 10) return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const today = new Date();
        const birthDate = new Date(formData.fechaNacimiento);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            age < 14 ||
            (age === 14 && monthDiff < 0) ||
            (age === 14 && monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            showNotification("error", "Edad inválida", "El usuario debe tener al menos 14 años.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            showNotification("error", "Correo inválido", "Ingrese un correo electrónico válido.");
            return;
        }

        const formattedData = {
            ...formData,
            fechaNacimiento: formData.fechaNacimiento || null
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