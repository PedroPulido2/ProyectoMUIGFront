import React, { useEffect, useState } from "react";
import styles from "../../styles/FormModal.module.css";
import { showNotification } from "../../utils/showNotification";
import SelectCatalogo from "../SelectCatalogo";
import {
    FOSIL_COLECCIONES,
    FOSIL_FILOS,
    FOSIL_SUBFILOS,
    FOSIL_CLASES,
    FOSIL_ORDENES,
    FOSIL_FAMILIAS,
    TIEMPOS_GEOLOGICOS_FOSIL,
    FOSIL_VITRINAS,
} from "../../utils/catalogos";

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

        // Solo campos de texto libre; los taxonómicos y de catálogo son <select>
        // y aceptan sus valores cerrados (guiones, paréntesis, etc.).
        if (name === "GENERO" || name === "NOMBRE_FOSIL" || name === "COLECTOR"
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
            <div className={styles.modalForm} onClick={closeModal}>
                <div className={styles.modalContentForm} onClick={(e) => e.stopPropagation()}>
                    <span className={styles.closeForm} onClick={closeModal}>
                        &times;
                    </span>
                    <h3>{fosilData ? "Editar Fósil" : "Añadir Fósil"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>ID Fosil:</label>
                            <div className={styles.idContainer}>
                                <select
                                    value={formData.ID_FOSIL_PREFIX || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, ID_FOSIL_PREFIX: e.target.value }))}
                                >
                                    <option value="MGUPTC-CPL-">MGUPTC-CPL-</option>
                                </select>
                                <input
                                    type="text"
                                    name="ID_FOSIL_SUFFIX"
                                    value={formData.ID_FOSIL_SUFFIX || ""}
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
                        <div className={styles.formGroup}>
                            <label>N_Barrantes:</label>
                            <input
                                type="text"
                                name="N_BARRANTES"
                                value={formData.N_BARRANTES || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Colección:</label>
                            <SelectCatalogo
                                name="COLECCION"
                                value={formData.COLECCION}
                                onChange={handleChange}
                                opciones={FOSIL_COLECCIONES}
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
                            <label>SubFilo:</label>
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
                        {/* ¡AQUÍ ESTABA EL BUG! Ahora Orden y Familia están separados correctamente */}
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
                            <label>Nombre Fosil:</label>
                            <input
                                type="text"
                                name="NOMBRE_FOSIL"
                                value={formData.NOMBRE_FOSIL || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Partes:</label>
                            <input
                                type="text"
                                name="PARTES"
                                value={formData.PARTES || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tiempo Geológico:</label>
                            <SelectCatalogo
                                name="TIEMPO_GEOLOGICO"
                                value={formData.TIEMPO_GEOLOGICO}
                                onChange={handleChange}
                                opciones={TIEMPOS_GEOLOGICOS_FOSIL}
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
                            <label>Vitrina:</label>
                            <SelectCatalogo
                                name="VITRINA"
                                value={formData.VITRINA}
                                onChange={handleChange}
                                opciones={FOSIL_VITRINAS}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Bandeja:</label>
                            <input
                                type="text"
                                name="BANDEJA"
                                value={formData.BANDEJA || ""}
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
                            {fosilData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default FosilFormModal;