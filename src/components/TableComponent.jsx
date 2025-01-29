import React, { useEffect, useState } from "react";
import '../styles/TableComponent.css'
import ImageModal from "./ImageModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ErrorImage from '../styles/images/Error-imagen.jpg'

const TableComponent = ({
    columns,  //Array de nombres de las columnas
    data,     //Array de datos de la tabla
    onCreate, //Funcion para el boton Crear
    onUpdate, //Funcion para el boton actulizar
    onDelete, //Funcion para el boton Borrar
}) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    //PAGINACION
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    //Calcula el total de paginas
    const totalPages = Math.ceil(data.length / rowsPerPage);

    //Filtrar los datos para mostrar solos de la pagina actual
    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const openModal = (imgSrc) => {
        setImageSrc(imgSrc);
        setIsOpen(true);
    };

    const closeModal = () => {
        setImageSrc("");
        setIsOpen(false);
    }

    const toggleRowExpansion = (index) => {
        setExpandedRow(index === expandedRow ? null : index);
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h3>Tabla</h3>
                {onCreate && (<button className="create-button" onClick={onCreate} >Crear Nuevo</button>)}
            </div>
            <table>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                        {(onUpdate || onDelete) && <th>ACCIONES</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            <tr>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}
                                        className={(!row[col] || String(row[col]).trim() === "N/A") ? "na-value" : ""}
                                        onClick={() => toggleRowExpansion(rowIndex)}
                                    >
                                        {row[col] && row[col].toString().startsWith("http") ? (
                                            <LazyLoadImage
                                                alt="Fósil"
                                                effect="blur"
                                                src={row[col]}
                                                className="table-image"
                                                onError={(e) => (e.target.src = ErrorImage)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(row[col]);
                                                }}
                                            />
                                        ) : (
                                            row[col] || "N/A"
                                        )}
                                    </td>
                                ))}
                                {(onUpdate || onDelete) && (
                                    <td className="action-buttons">
                                        {onUpdate && (<button className="update-button" onClick={() => onUpdate(row)}><span className="material-symbols-outlined">Edit</span></button>)}
                                        {onDelete && (<button className="delete-button" onClick={() => onDelete(row)}><span className="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z"/></svg></span></button>)}
                                        {onDelete && (<button className="delete-button" onClick={() => onDelete(row)}><span className="material-symbols-outlined">Delete</span></button>)}
                                    </td>
                                )}
                            </tr>
                            {expandedRow === rowIndex && (
                                <tr>
                                    <td colSpan={columns.length + 1}>
                                        <div
                                            className={`expanded-details-wrapper ${expandedRow === rowIndex ? "open" : ""}`}
                                        >
                                            <div className="expanded-details">
                                                {Object.entries(row).map(([key, value]) => (
                                                    <p key={key}>
                                                        <strong>{key}</strong>: {value || "N/A"}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {/**Controles de paginacion */}
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>

            <ImageModal
                isOpen={isOpen}
                modalImage={imageSrc}
                closeModal={closeModal}
            />
        </div>
    );
};

export default TableComponent;