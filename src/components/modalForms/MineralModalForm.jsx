import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';

const MineralFormModal = ({ isOpen, closeModal, onSave, mineralData }) => {
    const [formData, setFormData] = useState({
        "ID_MINERAL": "",
        "N_BARRANTES": "",
        "COLECCION": "",
        "NOMBRE_MINERAL": "",
        "CANTIDAD": "",
        "GRUPO_MINERALOGICO": "",
        "REGION": "",
        "SUBGRUPO": "",
        "COMPOSICION": "",
        "CARACTERISTICAS": "",
        "COLECTOR": "",
        "OBSERVACIONES": "",
        "UBICACION": "",
        "FOTO": null
    });

    useEffect(() => {
        if (mineralData) {
            setFormData({
                ...mineralData,
                FOTO: null
            });
        } else {
            setFormData({
                "ID_MINERAL": "",
                "N_BARRANTES": "",
                "COLECCION": "",
                "NOMBRE_MINERAL": "",
                "CANTIDAD": "",
                "GRUPO_MINERALOGICO": "",
                "REGION": "",
                "SUBGRUPO": "",
                "COMPOSICION": "",
                "CARACTERISTICAS": "",
                "COLECTOR": "",
                "OBSERVACIONES": "",
                "UBICACION": "",
                "FOTO": null
            });
        }
    }, [mineralData]);

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
                    <h3>{mineralData ? "Editar Mineral" : "Añadir Mineral"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID mineral:</label>
                            <input
                                type="text"
                                name="ID_MINERAL"
                                value={formData.ID_MINERAL}
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
                            <label>Colección:</label>
                            <input
                                type="text"
                                name="COLECCION"
                                value={formData.COLECCION}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre mineral:</label>
                            <input
                                type="text"
                                name="NOMBRE_MINERAL"
                                value={formData.NOMBRE_MINERAL}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Cantidad:</label>
                            <input
                                type="text"
                                name="CANTIDAD"
                                value={formData.CANTIDAD}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Grupo mineralogico:</label>
                            <input
                                type="text"
                                name="GRUPO_MINERALOGICO"
                                value={formData.GRUPO_MINERALOGICO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Region:</label>
                            <input
                                type="text"
                                name="REGION"
                                value={formData.REGION}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subgrupo:</label>
                            <input
                                type="text"
                                name="SUBGRUPO"
                                value={formData.SUBGRUPO}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Composición:</label>
                            <input
                                type="text"
                                name="COMPOSICION"
                                value={formData.COMPOSICION}
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
                            {mineralData ? "Actualizar" : "Guardar"}
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default MineralFormModal;