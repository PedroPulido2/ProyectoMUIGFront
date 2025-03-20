import Swal from "sweetalert2";

/**
 * Muestra una notificación con SweetAlert2.
 * @param {string} type - Tipo de notificación ("success", "error", "warning", "info").
 * @param {string} title - Título de la notificación.
 * @param {string} text - Mensaje de la notificación.
 */
export const showNotification = (type, title, text) => {
    Swal.fire({
        title: title,
        text: text,
        icon: type,
        confirmButtonText: "OK",
        timer: 3500,
        showClass: { popup: "animate__animated animate__fadeInDown" },
        hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
};

/**
 * Muestra una alerta de confirmación con SweetAlert2.
 * @param {string} title - Título de la alerta.
 * @param {string} text - Mensaje de confirmación.
 * @returns {Promise<SweetAlertResult>} - Devuelve el resultado de la confirmación.
 */
export const showConfirmation = async (title, text) => {
    return await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    });
};