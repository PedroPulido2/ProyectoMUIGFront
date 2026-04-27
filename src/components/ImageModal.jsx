import React from "react";
import styles from '../styles/ImageModal.module.css';

const ImageModal = ({ isOpen, modalImage, closeModal }) => {
    return (
        <div>
            {isOpen && (
                <div className={styles.modal} onClick={closeModal}>
                    <span className={styles.close} onClick={closeModal}>
                        &times;
                    </span>
                    <img src={modalImage} alt="Modal Preview" className={styles.modalContent} />
                </div>
            )}
        </div>
    );
};

export default ImageModal;