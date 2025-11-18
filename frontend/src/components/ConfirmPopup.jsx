// src/components/ConfirmPopup.jsx
import React from "react";
import "../styles/styles.css";

export default function ConfirmPopup({
    open,
    title = "Você quer excluir?",
    message = "Ao aceitar não será possível desfazer essa ação.",
    confirmLabel = "Aceitar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("confirmOverlay")) {
            onCancel && onCancel();
        }
    };

    return (
        <div className="confirmOverlay" onClick={handleOverlayClick}>
            <div className="confirmModal">
                <button
                    type="button"
                    className="confirmClose"
                    onClick={onCancel}
                    aria-label="Fechar"
                >
                    ×
                </button>

                <h3 className="confirmTitle">{title}</h3>
                <p className="confirmMessage">{message}</p>

                <div className="confirmButtons">
                    <button
                        type="button"
                        className="confirmBtn cancel"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        className="confirmBtn confirm"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
