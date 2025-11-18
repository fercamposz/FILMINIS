
import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/styles.css";
import ConfirmPopup from "../components/ConfirmPopup";
import Toast from "../components/Toast";

// ícones 
const IconeVG = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 3v18h18" />
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 15.3" />
    </svg>
);

const IconeFilmes = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
);

const IconeSair = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
    </svg>
);

// sidebar do administrador
function Sidebar({ activeView, onNavigate, onLogout }) {
    return (
        <aside className="adminSidebar">
            <h1 className="adminLogo">FILMINIS</h1>

            <nav className="adminNav">
                <button
                    className={`adminNavLink ${activeView === "overview" ? "active" : ""}`}
                    onClick={() => onNavigate("overview")}
                >
                    <IconeVG />
                    <span>Visão Geral</span>
                </button>

                <button
                    className={`adminNavLink ${activeView === "filmes" ? "active" : ""}`}
                    onClick={() => onNavigate("filmes")}
                >
                    <IconeFilmes />
                    <span>Filmes</span>
                </button>
            </nav>

            <button className="adminLogout" onClick={onLogout}>
                <IconeSair />
                <span>Sair</span>
            </button>
        </aside>
    );
}

// cards e tabelas da visão geral
function VisaoGeral({ filmes, onAprovar, onDeletar }) {
    const total = filmes.length;
    const pendentes = filmes.filter((f) => !f.aprovado);
    const aprovados = filmes.filter((f) => f.aprovado);

    return (
        <section className="adminSection">
            <h2>Visão Geral</h2>
            <p className="adminSubtitle">Resumo do catálogo.</p>

            {/* cards de estatísticas */}
            <div className="statCardGrid">
                <div className="statCard">
                    <div className="statCardIcon" style={{ background: "#540081" }}>
                        <IconeFilmes />
                    </div>
                    <div>
                        <div className="statCardValue">{total}</div>
                        <div className="statCardLabel">Filmes Totais</div>
                    </div>
                </div>

                <div className="statCard">
                    <div className="statCardIcon" style={{ background: "#1a7f3c" }}>✓</div>
                    <div>
                        <div className="statCardValue">{aprovados.length}</div>
                        <div className="statCardLabel">Aprovados</div>
                    </div>
                </div>

                <div className="statCard">
                    <div className="statCardIcon" style={{ background: "#CC2222" }}>!</div>
                    <div>
                        <div className="statCardValue">{pendentes.length}</div>
                        <div className="statCardLabel">Pendentes</div>
                    </div>
                </div>
            </div>

            {/* tabela pendentes */}
            <h3 className="adminSubheading">Pendentes de aprovação</h3>

            <div className="tableWrapper">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pôster</th>
                            <th>Título</th>
                            <th>Ano</th>
                            <th>Gênero</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pendentes.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                                    Nenhum filme pendente.
                                </td>
                            </tr>
                        ) : (
                            pendentes.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td>
                                        <img src={f.poster} alt={f.titulo} className="posterThumbnail" />
                                    </td>
                                    <td>{f.titulo}</td>
                                    <td>{f.ano}</td>
                                    <td>{f.genero}</td>

                                    <td className="actionCell">
                                        <button className="btnAction btnConfirm" onClick={() => onAprovar(f.id)}>
                                            ✓
                                        </button>
                                        <button className="btnAction btnDelete" onClick={() => onDeletar(f.id)}>
                                            🗑 Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

// gerenciamento completo (pendentes + aprovados)
function GerenciarFilmes({ filmes, onAprovar, onDeletar }) {
    const [searchTerm, setSearchTerm] = useState("");

    const pendentes = filmes.filter((f) => f.aprovado === 0);
    const aprovados = filmes.filter((f) => f.aprovado === 1);

    const filtro = (lista) =>
        lista.filter((f) => {
            const termo = searchTerm.toLowerCase();
            return (
                f.titulo.toLowerCase().includes(termo) ||
                f.genero.toLowerCase().includes(termo) ||
                String(f.id).includes(termo)
            );
        });

    return (
        <section className="adminSection">
            <h2>Filmes</h2>
            <p className="adminSubtitle">Gerencie todos os filmes cadastrados.</p>

            {/* busca */}
            <input
                type="text"
                className="adminSearch"
                placeholder="Buscar por ID, título ou gênero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* lista de pendentes */}
            <h3 className="adminSubheading">Pendentes</h3>

            <div className="tableWrapper">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pôster</th>
                            <th>Título</th>
                            <th>Ano</th>
                            <th>Gênero</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtro(pendentes).length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", color: "#777" }}>
                                    Nenhum pendente.
                                </td>
                            </tr>
                        ) : (
                            filtro(pendentes).map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td><img src={f.poster} alt={f.titulo} className="posterThumbnail" /></td>
                                    <td>{f.titulo}</td>
                                    <td>{f.ano}</td>
                                    <td>{f.genero}</td>

                                    <td><span className="status-tag pendente">Pendente</span></td>

                                    <td className="actionCell">
                                        <button className="btnAction btnConfirm" onClick={() => onAprovar(f.id)}>
                                            ✓
                                        </button>
                                        <button className="btnAction btnDelete" onClick={() => onDeletar(f.id)}>
                                            🗑 Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* lista de aprovados */}
            <h3 className="adminSubheading" style={{ marginTop: 30 }}>Aprovados</h3>

            <div className="tableWrapper">
                <table className="adminTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pôster</th>
                            <th>Título</th>
                            <th>Ano</th>
                            <th>Gênero</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtro(aprovados).length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", color: "#777" }}>
                                    Nenhum filme aprovado ainda.
                                </td>
                            </tr>
                        ) : (
                            filtro(aprovados).map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td><img src={f.poster} alt={f.titulo} className="posterThumbnail" /></td>
                                    <td>{f.titulo}</td>
                                    <td>{f.ano}</td>
                                    <td>{f.genero}</td>

                                    <td><span className="status-tag aprovado">Aprovado</span></td>

                                    <td className="actionCell">
                                        <button className="btnAction btnDelete" onClick={() => onDeletar(f.id)}>
                                            🗑 Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

// painel admin principal
export default function AdminPainel() {
    const [activeView, setActiveView] = useState("overview");
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);

    // toast notificação
    const [toast, setToast] = useState({
        open: false, message: "", type: "success"
    });

    // modal confirmar
    const [confirmState, setConfirmState] = useState({
        open: false, title: "", message: "", onConfirm: null
    });

    const showToast = (message, type = "success") =>
        setToast({ open: true, message, type });

    const closeToast = () =>
        setToast((prev) => ({ ...prev, open: false }));

    // carrega filmes
    async function carregarFilmes() {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const res = await api.get("/filmes", { headers });
            const data = res.data.filmes || res.data;
            setFilmes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erro ao carregar filmes:", err);
            if (err.response?.status >= 401) {
                alert("Acesso negado. Faça login como admin.");
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarFilmes();
    }, []);

    // aprovar filme
    async function aprovarFilme(id) {
        try {
            const token = localStorage.getItem("token");
            await api.post(`/filmes/${id}/aprovar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await carregarFilmes();
            showToast("Filme aprovado!", "success");
        } catch (err) {
            const msg = err.response?.data?.error || "Erro ao aprovar.";
            showToast(msg, "error");
        } finally {
            setConfirmState((prev) => ({ ...prev, open: false }));
        }
    }

    // deletar filme
    async function deletarFilme(id) {
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/filmes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await carregarFilmes();
            showToast("Filme deletado!", "success");
        } catch (err) {
            const msg = err.response?.data?.error || "Erro ao deletar.";
            showToast(msg, "error");
        } finally {
            setConfirmState((prev) => ({ ...prev, open: false }));
        }
    }

    // abre modal
    const pedirConfirmacaoAprovar = (id) =>
        setConfirmState({
            open: true,
            title: "Você quer aprovar?",
            message: "O filme ficará visível para todos.",
            onConfirm: () => aprovarFilme(id),
        });

    const pedirConfirmacaoDeletar = (id) =>
        setConfirmState({
            open: true,
            title: "Você quer excluir?",
            message: "Você não verá mais este filme.",
            onConfirm: () => deletarFilme(id),
        });

    // logout
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    }

    return (
        <div className="adminLayout">
            <Sidebar
                activeView={activeView}
                onNavigate={setActiveView}
                onLogout={handleLogout}
            />

            <main className="adminContent">
                {loading ? (
                    <div style={{ color: "#fff" }}>Carregando...</div>
                ) : activeView === "overview" ? (
                    <VisaoGeral
                        filmes={filmes}
                        onAprovar={pedirConfirmacaoAprovar}
                        onDeletar={pedirConfirmacaoDeletar}
                    />
                ) : (
                    <GerenciarFilmes
                        filmes={filmes}
                        onAprovar={pedirConfirmacaoAprovar}
                        onDeletar={pedirConfirmacaoDeletar}
                    />
                )}
            </main>

            {/* toast */}
            {toast.open && (
                <Toast message={toast.message} type={toast.type} onClose={closeToast} />
            )}

            {/* popup confirmar */}
            <ConfirmPopup
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                onCancel={() => setConfirmState((p) => ({ ...p, open: false }))}
                onConfirm={confirmState.onConfirm}
            />
        </div>
    );
}
