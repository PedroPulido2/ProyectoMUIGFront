import React from "react";
import styles from "../styles/FormModal.module.css";

// Select cerrado alimentado por una lista de catálogo.
// - nullable (por defecto): arranca vacío con "Seleccione...".
// - requerido: `requerido` activa la validación nativa del navegador.
// - compatibilidad con datos viejos: si el valor guardado no está en la
//   lista (ej. "Mamalia"), se muestra como "dato antiguo" para no perderlo
//   al editar; al guardar queda el nuevo valor elegido.
const SelectCatalogo = ({
    name,
    value,
    onChange,
    opciones,
    requerido = false,
    etiquetaVacia = "Seleccione...",
}) => {
    const esLegado = value !== "" && value !== null && value !== undefined && !opciones.includes(value);

    return (
        <select
            className={styles.styledSelect}
            name={name}
            value={value || ""}
            onChange={onChange}
            required={requerido}
        >
            <option value="">{etiquetaVacia}</option>
            {opciones.map((op) => (
                <option key={op} value={op}>
                    {op}
                </option>
            ))}
            {esLegado && <option value={value}>{value} (dato antiguo)</option>}
        </select>
    );
};

export default SelectCatalogo;
