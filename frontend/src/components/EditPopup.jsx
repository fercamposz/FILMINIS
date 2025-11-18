// src/components/EditPopup.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function EditPopup({ filme, onClose, onUpdated }) {
  const [form, setForm] = useState({
    titulo: filme.titulo,
    ano: filme.ano,
    genero: filme.genero,
    diretor: filme.diretor,
    duracao: filme.duracao,
    poster: filme.poster,
    sinopse: filme.sinopse,
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    try {
      const token = localStorage.getItem("token");

      const res = await api.put(`/filmes/${filme.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar.");
    }
  }

  return (
    <div className="popupOverlay">
      <div className="popupCard">
        <h2>Editar Filme</h2>

        <label>Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} />

        <label>Ano</label>
        <input name="ano" value={form.ano} onChange={handleChange} />

        <label>Gênero</label>
        <input name="genero" value={form.genero} onChange={handleChange} />

        <label>Diretor</label>
        <input name="diretor" value={form.diretor} onChange={handleChange} />

        <label>Duração</label>
        <input name="duracao" value={form.duracao} onChange={handleChange} />

        <label>Pôster</label>
        <input name="poster" value={form.poster} onChange={handleChange} />

        <label>Sinopse</label>
        <textarea name="sinopse" value={form.sinopse} onChange={handleChange} />

        <div className="popupActions">
          <button className="btnCancel" onClick={onClose}>Cancelar</button>
          <button className="btnSave" onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
