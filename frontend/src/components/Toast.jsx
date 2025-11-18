
import React, { useEffect } from "react";
import "../styles/styles.css";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    if (!message) return null;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose && onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    const isSuccess = type === "success";

    return (
        <div className="toastContainer">
            <div className={`toastBox ${isSuccess ? "toastSuccess" : "toastError"}`}>
                <div className="toastIcon">
                    {isSuccess ? "✔" : "!"}
                </div>
                <span className="toastText">{message}</span>
                <button
                    type="button"
                    className="toastClose"
                    onClick={onClose}
                    aria-label="Fechar mensagem"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
