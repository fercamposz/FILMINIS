
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/styles.css";

/* ícones de mostrar/esconder senha */
const IconeOlhoFechado = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17.94 17.94A10.07..." />
    <path d="M9.9 4.24A9.12..." />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconeOlhoAberto = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M1 12s4-8..." />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* componente de Login */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); 

  const defaultNonAdminPath = location.state?.from?.pathname || "/filmes";

  // estados do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ação de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const role = await login(username, password);

    if (role) {
      if (role === "admin") navigate("/admin-painel", { replace: true });
      else navigate(defaultNonAdminPath, { replace: true });
    } else {
      setErrorMsg("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>

        <form className="auth-form" onSubmit={handleLogin}>
          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          {/* usuário */}
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

          {/* senha */}
          <div className="auth-group password-group">
            <label className="auth-label">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* botão de mostrar/esconder */}
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconeOlhoFechado /> : <IconeOlhoAberto />}
            </button>
          </div>

          <button type="submit" className="auth-button">Entrar</button>
        </form>

        {/* link para registro */}
        <div className="auth-switch">
          Não tem conta?{" "}
          <Link to="/register" className="auth-switch-link">Registre-se</Link>
        </div>
      </div>
    </div>
  );
}
