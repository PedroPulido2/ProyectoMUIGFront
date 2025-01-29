import React, { useState } from "react";
import '../styles/ImageModal.css';

const ImageModal = ({isOpen, modalImage, closeModal}) => {
    return (
        <div>
            {isOpen && (
                <div className="modal" onClick={closeModal}>
                    <span className="close" onClick={closeModal}>
                        &times;
                    </span>
                    <img src={modalImage} alt="Modal Preview" className="modal-content" />
                </div>
            )}
        </div>
    );
};

export default ImageModal;