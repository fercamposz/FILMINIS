
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";

import IconEdit from "../assets/icons/editar.png";

export default function ListaFilmes() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState([]);

  // filtros usados na busca
  const [filtros, setFiltros] = useState({
    titulo: "",
    genero: "",
    diretor: "",
    ano: "",
  });

  // busca filmes no backend aplicando filtros
  const carregarFilmes = async () => {
    try {
      const params = {
        titulo: filtros.titulo,
        genero: filtros.genero,
        diretor: filtros.diretor,
        ano: filtros.ano,
      };

      const res = await api.get("/filmes", { params });
      setFilmes(res.data.filmes || []);
    } catch (err) {
      console.error("Erro ao carregar filmes:", err);
    }
  };

  // atualiza filmes a cada mudança de filtro
  useEffect(() => {
    carregarFilmes();
  }, [filtros]);

  // reseta todos os filtros
  const limparFiltros = () => {
    setFiltros({ titulo: "", genero: "", diretor: "", ano: "" });
  };

  return (
    <div className="listaContainer">

      {/* filtros laterais */}
      <aside className="filtros">
        <h2>Filtrar</h2>

        <form onSubmit={(e) => e.preventDefault()}>

          {/* título */}
          <div className="filtroBox">
            <label>Título</label>
            <input
              type="text"
              placeholder="Ex: Barbie"
              value={filtros.titulo}
              onChange={(e) =>
                setFiltros({
                  titulo: e.target.value,
                  genero: "",
                  diretor: "",
                  ano: filtros.ano,
                })
              }
            />
          </div>

          {/* gênero */}
          <div className="filtroBox">
            <label>Gênero</label>
            <input
              type="text"
              placeholder="Ex: Terror"
              value={filtros.genero}
              onChange={(e) =>
                setFiltros({
                  genero: e.target.value,
                  titulo: "",
                  diretor: "",
                  ano: filtros.ano,
                })
              }
            />
          </div>

          {/* diretor */}
          <div className="filtroBox">
            <label>Diretor</label>
            <input
              type="text"
              placeholder="Ex: Spielberg"
              value={filtros.diretor}
              onChange={(e) =>
                setFiltros({
                  diretor: e.target.value,
                  titulo: "",
                  genero: "",
                  ano: filtros.ano,
                })
              }
            />
          </div>

          {/* ano */}
          <div className="filtroBox">
            <label>Ano</label>
            <input
              type="number"
              placeholder="Ex: 2023"
              value={filtros.ano}
              onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
            />
          </div>

          {/* botões */}
          <button type="submit" className="btnFiltro">Aplicar Filtros</button>

          <button type="button" className="btnLimpar" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        </form>
      </aside>

      {/* grid de filmes */}
      <section className="filmesGrid">
        <div className="topoGrid">
          <h1>Filmes</h1>

          {/* botão de novo filme */}
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

              {/* botão editar */}
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
