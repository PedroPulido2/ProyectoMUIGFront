import React, { useEffect, useState } from "react";
import '../styles/FosilFormModal.css';

const FosilFormModal = ({ isOpen, closeModal, onSave, fosilData }) => {
    const [formData, setFormData] = useState({
        "ID_FOSIL": "",
        "N_BARRANTES": "",
        "COLECCION": "",
        "UBICACION": "",
        "FILO": "",
        "SUBFILO": "",
        "CLASE": "",
        "ORDEN": "",
        "FAMILIA": "",
        "GENERO": "",
        "NOMBRE_FOSIL": "",
        "PARTES": "",
        "TIEMPO_GEOLOGICO": "",
        "COLECTOR": "",
        "LOCALIDAD": "",
        "VITRINA": "",
        "BANDEJA": "",
        "OBSERVACIONES": "",
        "FOTO": null
    });

    useEffect(() => {
        if (fosilData) {
            setFormData({
                ...fosilData,
                FOTO: null
            });
        }
    }, [fosilData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData, 
            [name]: value,
        }));
    };

    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        setFormData((prevData)=>({
            ...prevData,
            FOTO: file,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                    <h3>{fosilData ? "Editar Fósil" : "Añadir Fósil"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID Fosil:</label>
                            <input
                                type="text"
                                name="ID_FOSIL"
                                value={formData.ID_FOSIL}
                                onChange={handleChange}
                                //disabled={fosilData} // No editable para edición
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre Fosil:</label>
                            <input
                                type="text"
                                name="NOMBRE_FOSIL"
                                value={formData.NOMBRE_FOSIL}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {/* Agrega los demás campos aquí de manera similar */}
                        <div className="form-group">
                            <label>Foto:</label>
                            <input
                                type="file"
                                name="FOTO"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="save-button">
                            {fosilData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default FosilFormModal;