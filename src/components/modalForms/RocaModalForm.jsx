import React, { useEffect, useState } from "react";
import { showNotification } from "../../utils/showNotification";
import '../../styles/FormModal.css';

const RocaFormModal = ({ isOpen, closeModal, onSave, rocaData }) => {
    const [formData, setFormData] = useState({
        ID_ROCA: "MGUPTC-CPT-",
        N_BARRANTES: "",
        OTROS: "",
        BD_C_VARGAS: "",
        TIPO: "",
        COLECCION: "",
        NOMBRE_PIEZA: "",
        DEPARTAMENTO: "",
        MUNICIPIO: "",
        COLECTOR_DONADOR: "",
        CARACTERISTICAS: "",
        OBSERVACIONES: "",
        UBICACION: "",
        FOTO: null
    });

    useEffect(() => {
        if (rocaData) {
            const suffix = rocaData.ID_ROCA?.replace("MGUPTC-CPT-", "") || "";
            setFormData({
                ...rocaData,
                ID_ROCA_PREFIX: "MGUPTC-CPT-",
                ID_ROCA_SUFFIX: suffix,
                FOTO: null
            });
        } else {
            setFormData({
                ID_ROCA_PREFIX: "MGUPTC-CPT-",
                ID_ROCA_SUFFIX: "",
                N_BARRANTES: "",
                OTROS: "",
                BD_C_VARGAS: "",
                TIPO: "",
                COLECCION: "",
                NOMBRE_PIEZA: "",
                DEPARTAMENTO: "",
                MUNICIPIO: "",
                COLECTOR_DONADOR: "",
                CARACTERISTICAS: "",
                OBSERVACIONES: "",
                UBICACION: "",
                FOTO: null
            });
        }
    }, [rocaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "N_BARRANTES") {
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 4) return;
        }

        if (name === "TIPO" || name === "NOMBRE_PIEZA" || name === "DEPARTAMENTO" || name === "MUNICIPIO" ||
            name === "COLECTOR_DONADOR") {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Verificar si el archivo es una imagen
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validImageTypes.includes(file.type)) {
            showNotification("warning", "Formato no válido", "Por favor, selecciona una imagen en formato JPG, JPEG o PNG.");

            e.target.value = "";
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            FOTO: file,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullID = formData.ID_ROCA_PREFIX + formData.ID_ROCA_SUFFIX;
        onSave({ ...formData, ID_ROCA: fullID });
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
                            <div className="id-container">
                                <select
                                    value={formData.ID_ROCA_PREFIX}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_ROCA_PREFIX: e.target.value }))}
                                >
                                    <option value="MGUPTC-CPT-">MGUPTC-CPT-</option>
                                </select>
                                <input
                                    type="text"
                                    name="ID_ROCA_SUFFIX"
                                    value={formData.ID_ROCA_SUFFIX}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!/^[a-zA-Z0-9]*$/.test(value)) return;
                                        if (value.length > 6) return;
                                        setFormData(prev => ({ ...prev, ID_ROCA_SUFFIX: value }));
                                    }}
                                    required
                                />
                            </div>
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