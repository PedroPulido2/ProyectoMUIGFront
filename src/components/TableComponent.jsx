import React, { useState } from "react";
import styles from '../styles/TableComponent.module.css'
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
    enableExport = false,
    canManage = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    searchTerm,
    onSearchChange,
    selectedColumn,
    onColumnChange
}) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    // Manejo de cambio de página
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && onPageChange) {
            onPageChange(newPage);
        }
    };

    const handleExport = () => {
        if (filteredData.length === 0) {
            alert("No hay datos para exportar");
            return;
        }

        const csvHeaders = columns.join(",");
        const csvRows = filteredData.map(row => {
            return columns.map(col => {
                let cell = row[col];
                if (cell === null || cell === undefined) {
                    cell = "";
                }
                cell = cell.toString();
                // Escapar comillas dobles y poner el texto entre comillas si contiene comas
                if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(",");
        });

        // Unir cabeceras y filas
        const csvString = [csvHeaders, ...csvRows].join("\n");

        //  Crear el archivo Blob y descargarlo
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `auditoria_logs_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.searchCreate}>
                    <select
                        value={selectedColumn}
                        onChange={(e) => onColumnChange(e.target.value)}
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
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {enableExport && (
                        <button
                            className={styles.exportButton}
                            onClick={handleExport}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                            Exportar
                        </button>
                    )}

                    {canManage && onCreate && (<button className={styles.createButton} onClick={onCreate}><svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#e8eaed"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg> Crear Nuevo</button>)}
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                        {canManage && (onUpdate || onDeleteImage || onDelete) && <th>ACCIONES</th>}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                <tr>
                                    {columns.map((col, colIndex) => {
                                        const isImage = row[col] && String(row[col]).trim().startsWith("http");
                                        const thumbnailUrl = isImage
                                            ? `${process.env.VITE_URL_BACK}/imagen/wm/load/${row[col].split('/d/')[1]?.split('/')[0] || null}?width=150`
                                            : "";

                                        const highResUrl = isImage

                                            ? `${process.env.VITE_URL_BACK}/imagen/wm/load/${row[col].split('/d/')[1]?.split('/')[0] || null}?width=1024`
                                            : "";
                                        return (
                                            <td
                                                key={colIndex}
                                                data-label={col}
                                                className={(!row[col] || String(row[col]).trim() === "N/A") ? "na-value" : ""}
                                                onClick={() => toggleRowExpansion(rowIndex)}
                                            >
                                                {isImage ? (
                                                    <LazyLoadImage
                                                        height={50}
                                                        src={thumbnailUrl}
                                                        effect="blur"
                                                        placeholderSrc={ErrorImage}
                                                        onError={(e) => { e.target.src = ErrorImage; }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImageSrc(highResUrl); // Usamos la URL grande para el modal
                                                            setIsOpen(true);
                                                        }}
                                                        className={styles.tableImage}
                                                    />
                                                ) : (
                                                    row[col] || "N/A"
                                                )}
                                            </td>
                                        );
                                    })}
                                    {
                                        canManage && (onUpdate || onDeleteImage || onDelete) && (
                                            <td className={styles.actionButtons}>
                                                {onUpdate && (<button className={styles.updateButton} onClick={() => onUpdate(row)}><span className="material-symbols-outlined">Edit</span></button>)}
                                                {onDeleteImage && (<button className={styles.deleteImageButton} onClick={() => onDeleteImage(row)}><span className="material-symbols-outlined">hide_image</span></button>)}
                                                {onDelete && (<button className={styles.deleteButton} onClick={() => onDelete(row)}><span className="material-symbols-outlined">Delete</span></button>)}
                                            </td>
                                        )
                                    }
                                </tr>
                                {/**Detalles adicionales que no se muestran en la tabla */}
                                {expandedRow === rowIndex && (
                                    <tr>
                                        <td colSpan={columns.length + 1}>
                                            <div className={`expanded-details-wrapper ${expandedRow === rowIndex ? "open" : ""}`}>
                                                <div className={styles.expandedDetails}>
                                                    <div className={styles.detailsColumn}>
                                                        {Object.entries(row).filter(([key]) => key !== "FOTO").slice(0, Math.ceil(Object.entries(row).length / 2)).map(([key, value]) => (
                                                            <p key={key}>
                                                                <strong>{key}</strong>: {value || "N/A"}
                                                            </p>
                                                        ))}
                                                    </div>
                                                    <div className={styles.detailsColumn}>
                                                        {Object.entries(row).filter(([key]) => key !== "FOTO").slice(Math.ceil(Object.entries(row).length / 2)).map(([key, value]) => (
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
            <div className={styles.paginationControls}>
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