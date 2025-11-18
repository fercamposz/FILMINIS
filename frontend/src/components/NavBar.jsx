import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/styles.css";
import Logo from "../assets/icons/logo.png"; 

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const usuarioStr = localStorage.getItem("usuario");
  const usuario = useMemo(() => {
    try {
      return usuarioStr ? JSON.parse(usuarioStr) : null;
    } catch {
      return null;
    }
  }, [usuarioStr]);

  const isAdmin = usuario?.is_admin;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navGlass">
      <div className="navInner">
        <div className="navLeft">
          <Link to="/" className="logoWrap">
            <img src={Logo} alt="Logo" className="logoIcon" />
            <span className="brandName">Filminis</span>
          </Link>
        </div>

        {/* CENTRO */}
        <nav className="navCenter">
          <Link
            to="/"
            className={isActive("/") ? "navLink navLinkActive" : "navLink"}
          >
            Home
          </Link>

          <Link
            to="/filmes"
            className={isActive("/filmes") ? "navLink navLinkActive" : "navLink"}
          >
            Filmes
          </Link>

          {token && (
            <Link
              to="/adicionar"
              className={isActive("/adicionar") ? "navLink navLinkActive" : "navLink"}
            >
              Adicionar Filme
            </Link>
          )}

          {/* ADMIN */}
          {isAdmin && (
            <Link
              to="/admin-painel"
              className={
                isActive("/admin-painel")
                  ? "navLink navLinkActive"
                  : "navLink navLinkAdmin"
              }
            >
              Painel Admin 
            </Link>
          )}
        </nav>

        {/* DIREITA */}
        <div className="navRight">
          {!token ? (
            <Link to="/login" className="navLink">Entrar</Link>
          ) : (
            <>
              <button className="btnSmallLogout" onClick={logout}>
                Sair
              </button>

              <Link to="/perfil" className="avatarButton">
                <div className="avatarCircle">👤</div>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
