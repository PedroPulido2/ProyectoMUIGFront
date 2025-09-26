import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';
import { showNotification } from "../../utils/showNotification";

const FosilFormModal = ({ isOpen, closeModal, onSave, fosilData }) => {
    const [formData, setFormData] = useState({
        ID_FOSIL_PREFIX: "MGUPTC-CPL-",
        ID_FOSIL_SUFFIX: "",
        N_BARRANTES: "",
        COLECCION: "",
        UBICACION: "",
        FILO: "",
        SUBFILO: "",
        CLASE: "",
        ORDEN: "",
        FAMILIA: "",
        GENERO: "",
        NOMBRE_FOSIL: "",
        PARTES: "",
        TIEMPO_GEOLOGICO: "",
        COLECTOR: "",
        LOCALIDAD: "",
        VITRINA: "",
        BANDEJA: "",
        OBSERVACIONES: "",
        FOTO: null
    });

    useEffect(() => {
        if (fosilData) {
            const suffix = fosilData.ID_FOSIL?.replace("MGUPTC-CPL-", "") || "";
            setFormData({
                ...fosilData,
                ID_FOSIL_PREFIX: "MGUPTC-CPL-",
                ID_FOSIL_SUFFIX: suffix,
                FOTO: null
            });
        } else {
            setFormData({
                ID_FOSIL_PREFIX: "MGUPTC-CPL-",
                ID_FOSIL_SUFFIX: "",
                N_BARRANTES: "",
                COLECCION: "",
                UBICACION: "",
                FILO: "",
                SUBFILO: "",
                CLASE: "",
                ORDEN: "",
                FAMILIA: "",
                GENERO: "",
                NOMBRE_FOSIL: "",
                PARTES: "",
                TIEMPO_GEOLOGICO: "",
                COLECTOR: "",
                LOCALIDAD: "",
                VITRINA: "",
                BANDEJA: "",
                OBSERVACIONES: "",
                FOTO: null
            });
        }
    }, [fosilData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "N_BARRANTES" || name === "PARTES") {
            if (!/^\d*$/.test(value)) return; // Permite solo números
            if (value.length > 4) return;
        }

        if (name === "FILO" || name === "SUBFILO" || name === "CLASE" || name === "ORDEN" || name === "FAMILIA" ||
            name === "GENERO" || name === "NOMBRE_FOSIL" || name === "COLECTOR"
        ) {
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
        const fullID = formData.ID_FOSIL_PREFIX + formData.ID_FOSIL_SUFFIX;
        onSave({ ...formData, ID_FOSIL: fullID });
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
                            <div className="id-container">
                                <select
                                    value={formData.ID_FOSIL_PREFIX || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_FOSIL_PREFIX: e.target.value }))}
                                >
                                    <option value="MGUPTC-CPL-">MGUPTC-CPL-</option>
                                </select>
                                <input
                                    type="text"
                                    name="ID_FOSIL_SUFFIX"
                                    value={formData.ID_FOSIL_SUFFIX}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!/^[a-zA-Z0-9]*$/.test(value)) return;
                                        if (value.length > 6) return;
                                        setFormData(prev => ({ ...prev, ID_FOSIL_SUFFIX: value }));
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
                            <label>Colección:</label>
                            <input
                                type="text"
                                name="COLECCION"
                                value={formData.COLECCION}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Filo:</label>
                            <input
                                type="text"
                                name="FILO"
                                value={formData.FILO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>SubFilo:</label>
                            <input
                                type="text"
                                name="SUBFILO"
                                value={formData.SUBFILO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Clase:</label>
                            <input
                                type="text"
                                name="CLASE"
                                value={formData.CLASE}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Orden:</label>
                            <input
                                type="text"
                                name="FAMILIA"
                                value={formData.FAMILIA}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Genero:</label>
                            <input
                                type="text"
                                name="GENERO"
                                value={formData.GENERO}
                                onChange={handleChange}
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
                        <div className="form-group">
                            <label>Partes:</label>
                            <input
                                type="text"
                                name="PARTES"
                                value={formData.PARTES}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tiempo Geológico:</label>
                            <input
                                type="text"
                                name="TIEMPO_GEOLOGICO"
                                value={formData.TIEMPO_GEOLOGICO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Colector:</label>
                            <input
                                type="text"
                                name="COLECTOR"
                                value={formData.COLECTOR}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Localidad:</label>
                            <input
                                type="text"
                                name="LOCALIDAD"
                                value={formData.LOCALIDAD}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Vitrina:</label>
                            <input
                                type="text"
                                name="VITRINA"
                                value={formData.VITRINA}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bandeja:</label>
                            <input
                                type="text"
                                name="BANDEJA"
                                value={formData.BANDEJA}
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
                            <label>Foto:</label>
                            <input
                                type="file"
                                name="FOTO"
                                accept="image/*"
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