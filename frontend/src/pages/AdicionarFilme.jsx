
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";
import Toast from "../components/Toast";

// trata erros 
const formatDRFErrors = (errorData) => {
    if (typeof errorData === "string") return errorData;
    if (typeof errorData === "object" && errorData !== null) {
        let messages = [];
        for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
                const fieldName =
                    key === "non_field_errors"
                        ? "Erro Geral"
                        : key.charAt(0).toUpperCase() + key.slice(1);
                messages.push(`${fieldName}: ${errorData[key].join(", ")}`);
            } else if (typeof errorData[key] === "string") {
                messages.push(errorData[key]);
            }
        }
        return messages.join(" | ");
    }
    return "Erro desconhecido.";
};

export default function AdicionarFilme() {
    const navigate = useNavigate();

    // inputs do formulário
    const [titulo, setTitulo] = useState("");
    const [ano, setAno] = useState("");
    const [genero, setGenero] = useState("");
       const [diretor, setDiretor] = useState("");
    const [sinopse, setSinopse] = useState("");
    const [poster, setPoster] = useState("");

    // toast
    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") =>
        setToast({ open: true, message, type });

    const handleCloseToast = () =>
        setToast((prev) => ({ ...prev, open: false }));

    // envia pro backend
    const enviar = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/filmes",
                {
                    titulo,
                    ano: Number(ano),
                    genero,
                    diretor,
                    sinopse,
                    poster,
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            showToast(
                "Filme adicionado! Ele ficará pendente até o admin aprovar.",
                "success"
            );

            setTimeout(() => {
                handleCloseToast();
                navigate("/filmes");
            }, 2600);
        } catch (err) {
            const status = err.response?.status;
            const errorData = err.response?.data;

            let message =
                "Erro ao adicionar o filme. Verifique os dados e tente novamente.";

            if (status === 401) {
                message = "Você precisa estar logado para adicionar filmes.";
            } else if (status === 403) {
                message = "Você não tem permissão para adicionar filmes.";
            } else if (errorData) {
                const formatted = formatDRFErrors(errorData);
                if (formatted && formatted !== "Erro desconhecido.") {
                    message = `Erro de validação: ${formatted}`;
                } else {
                    message =
                        errorData.detail ||
                        errorData.erro ||
                        errorData.message ||
                        message;
                }
            }

            showToast(message, "error");
        }
    };

    return (
        <div className="addContainer">
            <h1>Adicione seu filme</h1>

            {/* form */}
            <form className="formAdd" onSubmit={enviar}>
                <div className="linha">
                    <div className="campo">
                        <label>Título do filme</label>
                        <input
                            type="text"
                            required
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Ano de lançamento</label>
                        <input
                            type="number"
                            required
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                        />
                    </div>
                </div>

                <div className="linha">
                    <div className="campo">
                        <label>Gênero</label>
                        <input
                            type="text"
                            required
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                        />
                    </div>

                    <div className="campo">
                        <label>Diretor(a)</label>
                        <input
                            type="text"
                            required
                            value={diretor}
                            onChange={(e) => setDiretor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="campo">
                    <label>URL do pôster</label>
                    <input
                        type="text"
                        required
                        value={poster}
                        onChange={(e) => setPoster(e.target.value)}
                    />
                </div>

                <div className="campo">
                    <label>Sinopse</label>
                    <textarea
                        required
                        rows="5"
                        value={sinopse}
                        onChange={(e) => setSinopse(e.target.value)}
                    />
                </div>

                {/* botões */}
                <div className="botoes">
                    <button
                        type="button"
                        className="btnVoltar"
                        onClick={() => navigate("/filmes")}
                    >
                        Voltar
                    </button>

                    <button type="submit" className="btnEnviar">
                        Enviar
                    </button>
                </div>
            </form>

            {/* toast */}
            {toast.open && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}
        </div>
    );
}
