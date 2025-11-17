
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/styles.css";

// imagens da home
import home1 from "../assets/imagens/home1.png";
import home2 from "../assets/imagens/home2.png";
import linhaHome from "../assets/imagens/linhaHome.png";
import fogo from "../assets/icons/fogo.svg";

export default function Home() {
  const [trending, setTrending] = useState([]); 
  const [loading, setLoading] = useState(true);

  // carrega filmes do backend
  useEffect(() => {
    async function carregar() {
      try {
        const res = await api.get("/filmes");
        const data = res.data.filmes || [];
        setTrending(data.slice(0, 12)); 
      } catch (err) {
        console.error("Erro ao carregar →", err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return (
    <>
      {/* HERO da home */}
      <section className="homeHero">
        <div className="heroInner">

          {/* texto da esquerda */}
          <div className="heroLeft">
            <p className="eyeBrow">AGORA</p>

            <h1 className="heroTitle">
              <span className="titleLine1">OS MELHORES</span>
              <span className="titleLine2">EM CARTAZ</span>
            </h1>

            <p className="heroDesc">
              Five Nights At Freddy's - O Pesadelo Sem Fim é a primeira adaptação
              cinematográfica da franquia criada por Scott Cawthon.
            </p>

            <button className="btnPlay">
              <span className="btnIcon">▶</span> Assista já
            </button>
          </div>

          {/* curva + pôsteres */}
          <img src={linhaHome} className="heroCurve" aria-hidden="true" />

          <div className="heroRight">
            <div className="posterStack">
              <img src={home2} className="posterBack" />
              <img src={home1} className="posterFront" />
            </div>

            <div className="heroHorizontalAccent" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* TENDÊNCIAS */}
      <section className="trends">

        {/* cabeçalho */}
        <div className="trends-header">
          <div className="trends-left">
            <img src={fogo} className="trend-icon" />
            <h2 className="trends-title">Tendências</h2>
          </div>

          <Link to="/filmes" className="ver-mais">Ver mais →</Link>
        </div>

        {/* grid */}
        <div className="trends-grid melhor-grid">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="trend-card skeleton-card">
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-lines">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line small"></div>
                  </div>
                </div>
              ))
            : trending.map((movie) => (
                <Link
                  to={`/filmes/${movie.id}`}
                  key={movie.id}
                  className="trend-card melhor-card"
                >
                  <div className="melhor-thumb">
                    <img src={movie.poster} alt={movie.titulo} />
                  </div>

                  <div className="melhor-info">
                    <h4 className="melhor-title">{movie.titulo}</h4>
                    <p className="melhor-sub">
                      {movie.ano} • <span className="dot">●</span> {movie.diretor}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </section>
    </>
  );
}
