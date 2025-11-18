
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as apiRegister } from "../services/api";
import "../styles/styles.css";

// componente da página de registro
export default function Registro() {
  const navigate = useNavigate();

  // estados dos inputs e controles de erro/senha
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // validação simples de confirmação de senha
    if (password !== confirmPassword) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    try {
      // requisição para cadastrar usuário na API
      await apiRegister({
        username,
        email,
        password,
      });

      alert("Registro efetuado com sucesso!");
      navigate("/login");
    } catch (err) {
     
      let msg = "Erro ao registrar.";

      if (err.response?.data?.error) msg = err.response.data.error;
      else if (err.response?.status === 409) msg = "Usuário ou email já existe.";

      setErrorMsg(msg);
    }
  };

  return (
    // container geral da página
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Registrar</h1>

        {/* formulário de registro */}
        <form className="auth-form" onSubmit={handleRegistro}>

          {/* mensagem de erro, caso exista */}
          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          {/* campo usuário */}
          <div className="auth-group">
            <label className="auth-label">Usuário</label>
            <input
              type="text"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* campo email */}
          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* campo senha */}
          <div className="auth-group password-group">
            <label className="auth-label">Senha</label>
            <input
              type={showPassword ? "text" : "password"} // alterna visibilidade
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* campo confirmar senha */}
          <div className="auth-group password-group">
            <label className="auth-label">Confirmar Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* botão de registrar */}
          <button type="submit" className="auth-button">
            Registrar
          </button>
        </form>

        {/* link para login */}
        <div className="auth-switch">
          Já tem conta?{" "}
          <Link to="/login" className="auth-switch-link">Faça login</Link>
        </div>
      </div>
    </div>
  );
}
