import React, { useEffect, useState } from "react";
import { showNotification } from "../../utils/showNotification";
import '../../styles/FormModal.css';

const InvestigacionFormModal = ({ isOpen, closeModal, onSave, investigacionData }) => {
    const [formData, setFormData] = useState({
        ID_PIEZA_PREFIX: "",
        ID_PIEZA_SUFFIX: "",
        COLECCION: "",
        REPOSITORIO: "",
        FILO: "",
        SUBFILO: "",
        CLASE: "",
        ORDEN: "",
        FAMILIA: "",
        GENERO: "",
        NOMBRE: "",
        PERIODO_GEOLOGICO: "",
        ERA_GEOLOGICA: "",
        FORMACION_GEOLOGICA: "",
        SECCION_ESTRATIGRAFICA: "",
        COLECTOR: "",
        LOCALIDAD: "",
        OBSERVACIONES: "",
        FOTO: null
    });

    useEffect(() => {
        if (investigacionData) {
            const prefixes = ["MGUPTC-CPi-AFPC-", "MGUPTC-CPi-HRR-", "MGUPTC-CPi-MJGL-"];
            let selectedPrefix = prefixes.find(prefix => investigacionData.ID_PIEZA?.startsWith(prefix)) || "";
            let suffix = investigacionData.ID_PIEZA ? investigacionData.ID_PIEZA.replace(selectedPrefix, "") : "";

            setFormData({
                ...investigacionData,
                ID_PIEZA_PREFIX: selectedPrefix,
                ID_PIEZA_SUFFIX: suffix,
                FOTO: null
            });
        } else {
            setFormData({
                ID_PIEZA_PREFIX: "",
                ID_PIEZA_SUFFIX: "",
                COLECCION: "",
                REPOSITORIO: "",
                FILO: "",
                SUBFILO: "",
                CLASE: "",
                ORDEN: "",
                FAMILIA: "",
                GENERO: "",
                NOMBRE: "",
                PERIODO_GEOLOGICO: "",
                ERA_GEOLOGICA: "",
                FORMACION_GEOLOGICA: "",
                SECCION_ESTRATIGRAFICA: "",
                COLECTOR: "",
                LOCALIDAD: "",
                OBSERVACIONES: "",
                FOTO: null
            });
        }
    }, [investigacionData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        const fullID = formData.ID_PIEZA_PREFIX + formData.ID_PIEZA_SUFFIX;
        onSave({ ...formData, ID_PIEZA: fullID });
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
                    <h3>{investigacionData ? "Editar Investigación" : "Añadir Investigación"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID pieza:</label>
                            <div className="id-container">
                                <select
                                    value={formData.ID_PIEZA_PREFIX || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_PIEZA_PREFIX: e.target.value }))}
                                >
                                    <option value="">(Vacío)</option>
                                    <option value="MGUPTC-CPi-AFPC-">MGUPTC-CPi-AFPC-</option>
                                    <option value="MGUPTC-CPi-HRR-">MGUPTC-CPi-HRR-</option>
                                    <option value="MGUPTC-CPi-MJGL-">MGUPTC-CPi-MJGL-</option>
                                </select>
                                <input
                                    type="text"
                                    name="ID_PIEZA_SUFFIX"
                                    value={formData.ID_PIEZA_SUFFIX}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_PIEZA_SUFFIX: e.target.value }))}
                                    required
                                />
                            </div>
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
                            <label>Repositorio:</label>
                            <input
                                type="text"
                                name="REPOSITORIO"
                                value={formData.REPOSITORIO}
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
                            <label>Subfilo:</label>
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
                                name="ORDEN"
                                value={formData.ORDEN}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Familia:</label>
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
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="NOMBRE"
                                value={formData.NOMBRE}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Periodo Geológico:</label>
                            <input
                                type="text"
                                name="PERIODO_GEOLOGICO"
                                value={formData.PERIODO_GEOLOGICO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Era Geológica:</label>
                            <input
                                type="text"
                                name="ERA_GEOLOGICA"
                                value={formData.ERA_GEOLOGICA}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Formación Geológica:</label>
                            <input
                                type="text"
                                name="FORMACION_GEOLOGICA"
                                value={formData.FORMACION_GEOLOGICA}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Sección Estratigráfica:</label>
                            <input
                                type="text"
                                name="SECCION_ESTRATIGRAFICA"
                                value={formData.SECCION_ESTRATIGRAFICA}
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
                            {investigacionData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default InvestigacionFormModal;