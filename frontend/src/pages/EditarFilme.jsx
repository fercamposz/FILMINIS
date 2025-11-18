
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";
import Toast from "../components/Toast";

export default function EditarFilme() {
    const { id } = useParams();              
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // dados do formulário
    const [form, setForm] = useState({
        titulo: "",
        ano: "",
        genero: "",
        diretor: "",
        sinopse: "",
        poster: "",
        duracao: "",
    });

    // controle do toast
    const [toast, setToast] = useState({
        open: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ open: true, message, type });
    };

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false, message: "" }));
    };

    // ----- carrega os dados do filme -----
    useEffect(() => {
        async function carregar() {
            setCarregando(true);
            setErrorMsg("");

            try {
                const res = await api.get(`/filmes/${id}`);
                setForm(res.data); // preenche form
            } catch (err) {
                const status = err.response?.status;
                if (status === 404) alert("Filme não encontrado.");
                else alert("Erro ao carregar filme.");
                navigate("/filmes");
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [id, navigate]);

    // ----- salva edição -----
    async function salvar(e) {
        e.preventDefault();
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");

            await api.put(`/filmes/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            showToast("Filme editado com sucesso!");

            setTimeout(() => {
                handleCloseToast();
                navigate(`/filmes/${id}`);
            }, 2600);
        } catch (err) {
            console.log("ERRO PUT:", err.response);
            setErrorMsg("Erro ao salvar alterações.");
            showToast("Erro ao salvar alterações.", "error");
        }
    }

    if (carregando) return <div className="det-error">Carregando...</div>;

    return (
        <div className="editContainer">
            <h1>Editar Filme</h1>

            {errorMsg && <div className="auth-error">{errorMsg}</div>}

            {/* formulário */}
            <form className="formEdit" onSubmit={salvar}>
                <label>Título</label>
                <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />

                <label>Ano</label>
                <input
                    type="number"
                    value={form.ano}
                    onChange={(e) => setForm({ ...form, ano: e.target.value })}
                />

                <label>Gênero</label>
                <input
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                />

                <label>Diretor</label>
                <input
                    value={form.diretor}
                    onChange={(e) => setForm({ ...form, diretor: e.target.value })}
                />

                <label>Duração</label>
                <input
                    value={form.duracao}
                    onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                />

                <label>Poster (URL)</label>
                <input
                    value={form.poster}
                    onChange={(e) => setForm({ ...form, poster: e.target.value })}
                />

                <label>Sinopse</label>
                <textarea
                    rows="5"
                    value={form.sinopse}
                    onChange={(e) => setForm({ ...form, sinopse: e.target.value })}
                />

                {/* botões */}
                <div className="botoes">
                    <button
                        type="button"
                        className="btnVoltar"
                        onClick={() => navigate(`/filmes/${id}`)}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btnSalvar">
                        Salvar
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
