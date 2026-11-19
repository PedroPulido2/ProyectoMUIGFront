import React, { useEffect, useState } from "react";
import { showNotification } from "../../utils/showNotification";
import styles from "../../styles/FormModal.module.css";
import SelectCatalogo from "../SelectCatalogo";
import {
    INVESTIGACION_COLECCIONES,
    FOSIL_FILOS,
    FOSIL_SUBFILOS,
    FOSIL_CLASES,
    FOSIL_ORDENES,
    FOSIL_FAMILIAS,
    PERIODOS_GEOLOGICOS,
    ERAS_GEOLOGICAS,
} from "../../utils/catalogos";

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
        const defaultPrefix = "MGUPTC-CPi-AFPC-";
        const prefixes = ["MGUPTC-CPi-AFPC-", "MGUPTC-CPi-HRR-", "MGUPTC-CPi-MJGL-"];

        if (investigacionData) {
            let selectedPrefix =
                prefixes.find(prefix => investigacionData.ID_PIEZA?.startsWith(prefix)) || defaultPrefix;

            let suffix =
                investigacionData.ID_PIEZA?.replace(selectedPrefix, "") || "";

            setFormData({
                ...investigacionData,
                ID_PIEZA_PREFIX: selectedPrefix,
                ID_PIEZA_SUFFIX: suffix,
                FOTO: null
            });
        } else {
            setFormData({
                ID_PIEZA_PREFIX: defaultPrefix,
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

        // Solo campos de texto libre; colección, taxonomía, periodo y era son <select>.
        if (name === "GENERO" ||
            name === "NOMBRE" || name === "FORMACION_GEOLOGICA" || name === "COLECTOR"
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
        const fullID = formData.ID_PIEZA_PREFIX + formData.ID_PIEZA_SUFFIX;
        onSave({ ...formData, ID_PIEZA: fullID });
        closeModal();
    };

    if (!isOpen) return null;

    return (
        isOpen && (
            <div className={styles.modalForm} onClick={closeModal}>
                <div className={styles.modalContentForm} onClick={(e) => e.stopPropagation()}>
                    <span className={styles.closeForm} onClick={closeModal}>
                        &times;
                    </span>
                    <h3>{investigacionData ? "Editar Investigación" : "Añadir Investigación"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>ID pieza:</label>
                            <div className={styles.idContainer}>
                                <select
                                    value={formData.ID_PIEZA_PREFIX || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_PIEZA_PREFIX: e.target.value }))}
                                >
                                    <option value="MGUPTC-CPi-AFPC-">MGUPTC-CPi-AFPC-</option>
                                    <option value="MGUPTC-CPi-HRR-">MGUPTC-CPi-HRR-</option>
                                    <option value="MGUPTC-CPi-MJGL-">MGUPTC-CPi-MJGL-</option>
                                </select>
                                <input
                                    type="text"
                                    name="ID_PIEZA_SUFFIX"
                                    value={formData.ID_PIEZA_SUFFIX || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!/^[a-zA-Z0-9]*$/.test(value)) return;
                                        if (value.length > 6) return;
                                        setFormData(prev => ({ ...prev, ID_PIEZA_SUFFIX: value }));
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Colección:</label>
                            <SelectCatalogo
                                name="COLECCION"
                                value={formData.COLECCION}
                                onChange={handleChange}
                                opciones={INVESTIGACION_COLECCIONES}
                                requerido
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Repositorio:</label>
                            <input
                                type="text"
                                name="REPOSITORIO"
                                value={formData.REPOSITORIO || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Filo:</label>
                            <SelectCatalogo
                                name="FILO"
                                value={formData.FILO}
                                onChange={handleChange}
                                opciones={FOSIL_FILOS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Subfilo:</label>
                            <SelectCatalogo
                                name="SUBFILO"
                                value={formData.SUBFILO}
                                onChange={handleChange}
                                opciones={FOSIL_SUBFILOS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Clase:</label>
                            <SelectCatalogo
                                name="CLASE"
                                value={formData.CLASE}
                                onChange={handleChange}
                                opciones={FOSIL_CLASES}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Orden:</label>
                            <SelectCatalogo
                                name="ORDEN"
                                value={formData.ORDEN}
                                onChange={handleChange}
                                opciones={FOSIL_ORDENES}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Familia:</label>
                            <SelectCatalogo
                                name="FAMILIA"
                                value={formData.FAMILIA}
                                onChange={handleChange}
                                opciones={FOSIL_FAMILIAS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Genero:</label>
                            <input
                                type="text"
                                name="GENERO"
                                value={formData.GENERO || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="NOMBRE"
                                value={formData.NOMBRE || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Periodo Geológico:</label>
                            <SelectCatalogo
                                name="PERIODO_GEOLOGICO"
                                value={formData.PERIODO_GEOLOGICO}
                                onChange={handleChange}
                                opciones={PERIODOS_GEOLOGICOS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Era Geológica:</label>
                            <SelectCatalogo
                                name="ERA_GEOLOGICA"
                                value={formData.ERA_GEOLOGICA}
                                onChange={handleChange}
                                opciones={ERAS_GEOLOGICAS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Formación Geológica:</label>
                            <input
                                type="text"
                                name="FORMACION_GEOLOGICA"
                                value={formData.FORMACION_GEOLOGICA || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sección Estratigráfica:</label>
                            <input
                                type="text"
                                name="SECCION_ESTRATIGRAFICA"
                                value={formData.SECCION_ESTRATIGRAFICA || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Colector:</label>
                            <input
                                type="text"
                                name="COLECTOR"
                                value={formData.COLECTOR || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Localidad:</label>
                            <input
                                type="text"
                                name="LOCALIDAD"
                                value={formData.LOCALIDAD || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Observaciones:</label>
                            <input
                                type="text"
                                name="OBSERVACIONES"
                                value={formData.OBSERVACIONES || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Foto:</label>
                            <input
                                type="file"
                                name="FOTO"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className={styles.saveButton}>
                            {investigacionData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default InvestigacionFormModal;