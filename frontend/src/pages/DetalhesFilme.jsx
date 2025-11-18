
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";

// botão editar
import IconEdit from "../assets/icons/editar.png";

export default function DetalhesFilme() {
  const { id } = useParams();          
  const navigate = useNavigate();

  const [filme, setFilme] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // carrega detalhes do filme
  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro("");

      try {
        const res = await api.get(`/filmes/${id}`);
        setFilme(res.data);
      } catch (error) {
        const status = error.response?.status;
        if (status === 404) setErro("Filme não encontrado ou não aprovado.");
        else setErro("Não foi possível carregar os detalhes do filme.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  // estados visuais
  if (loading)
    return <div className="det-error">Carregando detalhes do filme...</div>;

  if (erro || !filme)
    return <div className="det-error">{erro || "Filme não encontrado."}</div>;

  const posterUrl = filme.poster;

  // navegações rápidas
  const handleEditar = () => navigate(`/filmes/${id}/editar`);
  const handleGeneroClick = () =>
    navigate(`/filmes?genero=${encodeURIComponent(filme.genero)}`);
  const handleVoltar = () => navigate(-1);

  return (
    <div className="det-page">

      {/* HERO do filme */}
      <div
        className="det-hero-section"
        style={{ backgroundImage: `url(${posterUrl})` }}
      >
        <div className="det-hero-overlay" />

        <div className="det-hero-meta">
          <span>{filme.ano}</span>
          <span>•</span>
          <span>{filme.genero}</span>

          {/* botão editar */}
          <button
            type="button"
            className="btnEditarHero"
            onClick={handleEditar}
          >
            <img src={IconEdit} alt="Editar" width={22} height={22} />
          </button>
        </div>
      </div>

      {/* conteúdo principal */}
      <div className="det-content-section">

        <div className="det-poster">
          <img src={posterUrl} alt={filme.titulo} />
        </div>

        <div className="det-info">
          <button className="btnVoltar" onClick={handleVoltar}>
            ← Voltar
          </button>

          <h1 style={{ marginTop: 20, marginBottom: 10 }}>
            {filme.titulo}
          </h1>

          <div className="info-linha">
            <strong>Diretor:</strong> {filme.diretor || "Não informado"}
          </div>

          <div className="info-linha">
            <strong>Ano:</strong> {filme.ano}
          </div>

          <div className="det-sinopse">{filme.sinopse}</div>

          <div className="det-generos">
            <button className="btnGenero" onClick={handleGeneroClick}>
              {filme.genero}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
