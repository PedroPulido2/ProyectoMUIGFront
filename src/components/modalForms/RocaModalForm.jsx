import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';

const RocaFormModal = ({ isOpen, closeModal, onSave, rocaData }) => {
    const [formData, setFormData] = useState({
        "ID_ROCA": "",
        "N_BARRANTES": "",
        "OTROS": "",
        "BD_C_VARGAS": "",
        "TIPO": "",
        "COLECCION": "",
        "NOMBRE_PIEZA": "",
        "DEPARTAMENTO": "",
        "MUNICIPIO": "",
        "COLECTOR_DONADOR": "",
        "CARACTERISTICAS": "",
        "OBSERVACIONES": "",
        "UBICACION": "",
        "FOTO": null
    });

    useEffect(() => {
        if (rocaData) {
            setFormData({
                ...rocaData,
                FOTO: null
            });
        } else {
            setFormData({
                "ID_ROCA": "",
                "N_BARRANTES": "",
                "OTROS": "",
                "BD_C_VARGAS": "",
                "TIPO": "",
                "COLECCION": "",
                "NOMBRE_PIEZA": "",
                "DEPARTAMENTO": "",
                "MUNICIPIO": "",
                "COLECTOR_DONADOR": "",
                "CARACTERISTICAS": "",
                "OBSERVACIONES": "",
                "UBICACION": "",
                "FOTO": null
            });
        }
    }, [rocaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
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
                    <h3>{rocaData ? "Editar Roca" : "Añadir Roca"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID roca:</label>
                            <input
                                type="text"
                                name="ID_ROCA"
                                value={formData.ID_ROCA}
                                onChange={handleChange}
                                required
                            //disabled={fosilData} // No editable para edición
                            />
                        </div>
                        <div className="form-group">
                            <label>N_Barrantes:</label>
                            <input
                                type="text"
                                name="N_BARRANTES"
                                value={formData.N_BARRANTES}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Otros:</label>
                            <input
                                type="text"
                                name="OTROS"
                                value={formData.OTROS}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>BD_C_VARGAS:</label>
                            <input
                                type="text"
                                name="BD_C_VARGAS"
                                value={formData.BD_C_VARGAS}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo:</label>
                            <input
                                type="text"
                                name="TIPO"
                                value={formData.TIPO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Colección:</label>
                            <input
                                type="text"
                                name="COLECCION"
                                value={formData.COLECCION}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre de la Pieza:</label>
                            <input
                                type="text"
                                name="NOMBRE_PIEZA"
                                value={formData.NOMBRE_PIEZA}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Departamento:</label>
                            <input
                                type="text"
                                name="DEPARTAMENTO"
                                value={formData.DEPARTAMENTO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Municipio:</label>
                            <input
                                type="text"
                                name="MUNICIPIO"
                                value={formData.MUNICIPIO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Colector o Donador:</label>
                            <input
                                type="text"
                                name="COLECTOR_DONADOR"
                                value={formData.COLECTOR_DONADOR}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Caracteristicas:</label>
                            <input
                                type="text"
                                name="CARACTERISTICAS"
                                value={formData.CARACTERISTICAS}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Observaciones:</label>
                            <input
                                type="text"
                                name="OBSERVACIONES"
                                value={formData.OBSERVACIONES}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ubicación:</label>
                            <input
                                type="text"
                                name="UBICACION"
                                value={formData.UBICACION}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Foto:</label>
                            <input
                                type="file"
                                name="FOTO"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="save-button">
                            {rocaData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default RocaFormModal;