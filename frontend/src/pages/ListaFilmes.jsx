import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";
import IconEdit from "../assets/icons/editar.png";

export default function ListaFilmes() {
    const navigate = useNavigate();

    const [todosFilmes, setTodosFilmes] = useState([]);   
    const [filmes, setFilmes] = useState([]);             

    const [filtros, setFiltros] = useState({
        titulo: "",
        genero: "",
        diretor: "",
        ano: "",
    });

   
    // CARREGA TODOS OS FILMES 1X
 
    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/filmes");
                setTodosFilmes(res.data.filmes || []);
                setFilmes(res.data.filmes || []);
            } catch (err) {
                console.error("Erro ao carregar filmes:", err);
            }
        }
        load();
    }, []);

   
    //  FILTRO 100% NO FRONT
   
    useEffect(() => {
        let filtrados = [...todosFilmes];

        const t = filtros.titulo.trim().toLowerCase();
        const g = filtros.genero.trim().toLowerCase();
        const d = filtros.diretor.trim().toLowerCase();
        const a = filtros.ano.trim();

        if (t) {
            filtrados = filtrados.filter((f) =>
                f.titulo.toLowerCase().includes(t)
            );
        }

        if (g) {
            filtrados = filtrados.filter((f) =>
                f.genero.toLowerCase().includes(g)
            );
        }

        if (d) {
            filtrados = filtrados.filter((f) =>
                f.diretor.toLowerCase().includes(d)
            );
        }

        if (a) {
            filtrados = filtrados.filter((f) => String(f.ano) === a);
        }

        setFilmes(filtrados);
    }, [filtros, todosFilmes]);


    // HANDLE INPUTS

    const handleChange = (campo, valor) => {
        setFiltros({
            ...filtros,
            [campo]: valor,
        });
    };

    const limparFiltros = () => {
        setFiltros({
            titulo: "",
            genero: "",
            diretor: "",
            ano: "",
        });
    };

    // RENDER

    return (
        <div className="listaContainer">

            {/* FILTROS */}
            <aside className="filtros">
                <h2>Filtrar</h2>

                <div className="filtroBox">
                    <label>Título</label>
                    <input
                        type="text"
                        value={filtros.titulo}
                        placeholder="Ex: Barbie"
                        onChange={(e) => handleChange("titulo", e.target.value)}
                    />
                </div>

                <div className="filtroBox">
                    <label>Gênero</label>
                    <input
                        type="text"
                        value={filtros.genero}
                        placeholder="Ex: Terror"
                        onChange={(e) => handleChange("genero", e.target.value)}
                    />
                </div>

                <div className="filtroBox">
                    <label>Diretor</label>
                    <input
                        type="text"
                        value={filtros.diretor}
                        placeholder="Ex: Burton"
                        onChange={(e) => handleChange("diretor", e.target.value)}
                    />
                </div>

                <div className="filtroBox">
                    <label>Ano</label>
                    <input
                        type="number"
                        value={filtros.ano}
                        placeholder="Ex: 2023"
                        onChange={(e) => handleChange("ano", e.target.value)}
                    />
                </div>

                <button className="btnLimpar" onClick={limparFiltros}>
                    Limpar Filtros
                </button>
            </aside>

            {/* GRID DOS FILMES */}
            <section className="filmesGrid">
                <div className="topoGrid">
                    <h1>Filmes</h1>
                    <button className="btnNovo" onClick={() => navigate("/adicionar")}>
                        + Novo Filme
                    </button>
                </div>

                <div className="grid">
                    {filmes.map((f) => (
                        <div
                            key={f.id}
                            className="cardFilme"
                            onClick={() => navigate(`/filmes/${f.id}`)}
                        >
                            <img src={f.poster} alt={f.titulo} className="poster" />

                            <div className="info">
                                <h4>{f.titulo}</h4>
                                <p>{f.ano}</p>
                                <p>{f.genero}</p>
                            </div>

                            <button
                                className="btnEditar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/filmes/${f.id}/editar`);
                                }}
                            >
                                <img src={IconEdit} alt="Editar" className="iconEditar" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
