import React, { useState } from "react";
import '../styles/TableComponent.css'
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ErrorImage from '../styles/images/Error-imagen.jpg'
import ImageModal from "./ImageModal";

const TableComponent = ({
    allColumns, //Array de todas las columnas
    columns,  //Array de nombres de las columnas
    data,     //Array de datos de la tabla
    onCreate, //Funcion para el boton Crear
    onUpdate, //Funcion para el boton actulizar
    onDeleteImage, //Funcion para el boton BorrarImagen
    onDelete, //Funcion para el boton Borrar
}) => {
    const isAdmin = Number(localStorage.getItem('isAdmin')) || 0;

    const [expandedRow, setExpandedRow] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedColumn, setSelectedColumn] = useState(allColumns[0]);

    //PAGINACION
    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    //Filtracion de consulta por id
    const filteredData = data.filter((row) =>
        row[selectedColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Paginacion con los datos filtrados
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Manejo de cambio de página
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    //Configuracion de modales
    const openModal = (imgSrc) => {
        setImageSrc(imgSrc);
        setIsOpen(true);
    };

    const closeModal = () => {
        setImageSrc("");
        setIsOpen(false);
    }

    //Cuadro de informacion adicional de la fila
    const toggleRowExpansion = (index) => {
        setExpandedRow(index === expandedRow ? null : index);
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <div className="search-create">
                    <select
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                    >
                        {allColumns
                            .filter(col => col !== "FOTO")
                            .map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {(isAdmin === 2 || isAdmin === 3) && onCreate && (<button className="create-button" onClick={onCreate}><svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e8eaed"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg> Crear Nuevo</button>)}
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                        {(isAdmin === 2 || isAdmin === 3) && (onUpdate || onDeleteImage || onDelete) && <th>ACCIONES</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                <tr>
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex}
                                            className={(!row[col] || String(row[col]).trim() === "N/A") ? "na-value" : ""}
                                            onClick={() => toggleRowExpansion(rowIndex)}
                                        >
                                            {row[col] && row[col].toString().startsWith("http") ? (
                                                <LazyLoadImage
                                                    effect="blur"
                                                    src={`${import.meta.env.VITE_URL_BACK}/imagen/load/${row[col].split('/d/')[1]?.split('/')[0] || null}`}
                                                    className="table-image"
                                                    threshold={300}
                                                    onError={(e) => (e.target.src = ErrorImage)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(`${process.env.VITE_URL_BACK}/imagen/load/${row[col].split('/d/')[1]?.split('/')[0] || null}`);
                                                    }}
                                                />
                                            ) : (
                                                row[col] || "N/A"
                                            )}
                                        </td>
                                    ))}
                                    {(isAdmin === 2 || isAdmin === 3) && (onUpdate || onDeleteImage || onDelete) && (
                                        <td className="action-buttons">
                                            {onUpdate && (<button className="update-button" onClick={() => onUpdate(row)}><span className="material-symbols-outlined">Edit</span></button>)}
                                            {onDeleteImage && (<button className="delete-image-button" onClick={() => onDeleteImage(row)}><span className="material-symbols-outlined"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="m840-234-80-80v-446H314l-80-80h526q33 0 56.5 23.5T840-760v526ZM792-56l-64-64H200q-33 0-56.5-23.5T120-200v-528l-64-64 56-56 736 736-56 56ZM240-280l120-160 90 120 33-44-283-283v447h447l-80-80H240Zm297-257ZM424-424Z" /></svg></span></button>)}
                                            {onDelete && (<button className="delete-button" onClick={() => onDelete(row)}><span className="material-symbols-outlined">Delete</span></button>)}
                                        </td>
                                    )}
                                </tr>
                                {/**Detalles adicionales que no se muestran en la tabla */}
                                {expandedRow === rowIndex && (
                                    <tr>
                                        <td colSpan={columns.length + 1}>
                                            <div className={`expanded-details-wrapper ${expandedRow === rowIndex ? "open" : ""}`}>
                                                <div className="expanded-details">
                                                    <div className="details-column">
                                                        {Object.entries(row).slice(0, Math.ceil(Object.entries(row).length / 2)).map(([key, value]) => (
                                                            <p key={key}>
                                                                <strong>{key}</strong>: {value || "N/A"}
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <div className="details-column">
                                                        {Object.entries(row).slice(Math.ceil(Object.entries(row).length / 2)).map(([key, value]) => (
                                                            <p key={key}>
                                                                <strong>{key}</strong>: {value || "N/A"}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                No se encontraron resultados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/**Controles de paginacion */}
            <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span style={{ margin: "0 10px" }}>
                    Página {currentPage} de {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
            </div>
            {/**Modal para mostrar las imagenes */}
            <ImageModal
                isOpen={isOpen}
                modalImage={imageSrc}
                closeModal={closeModal}
            />
        </div>
    );
};

export default TableComponent;