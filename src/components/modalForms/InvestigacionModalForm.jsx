import React, { useEffect, useState } from "react";
import '../../styles/FormModal.css';

const InvestigacionFormModal = ({ isOpen, closeModal, onSave, investigacionData }) => {
    const [formData, setFormData] = useState({
        "ID_PIEZA": "",
        "COLECCION": "",
        "REPOSITORIO": "",
        "FILO": "",
        "SUBFILO": "",
        "CLASE": "",
        "ORDEN": "",
        "FAMILIA": "",
        "GENERO": "",
        "NOMBRE": "",
        "PERIODO_GEOLOGICO": "",
        "ERA_GEOLOGICA": "",
        "FORMACION_GEOLOGICA": "",
        "SECCION_ESTRATIGRAFICA": "",
        "COLECTOR": "",
        "LOCALIDAD": "",
        "OBSERVACIONES": "",
        "FOTO": null
    });

    useEffect(() => {
        if (investigacionData) {
            setFormData({
                ...investigacionData,
                FOTO: null
            });
        } else {
            setFormData({
                "ID_PIEZA": "",
                "COLECCION": "",
                "REPOSITORIO": "",
                "FILO": "",
                "SUBFILO": "",
                "CLASE": "",
                "ORDEN": "",
                "FAMILIA": "",
                "GENERO": "",
                "NOMBRE": "",
                "PERIODO_GEOLOGICO": "",
                "ERA_GEOLOGICA": "",
                "FORMACION_GEOLOGICA": "",
                "SECCION_ESTRATIGRAFICA": "",
                "COLECTOR": "",
                "LOCALIDAD": "",
                "OBSERVACIONES": "",
                "FOTO": null
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
                    <h3>{investigacionData ? "Editar Investigación" : "Añadir Investigación"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ID pieza:</label>
                            <input
                                type="text"
                                name="ID_PIEZA"
                                value={formData.ID_PIEZA}
                                onChange={handleChange}
                                required
                            //disabled={fosilData} // No editable para edición
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