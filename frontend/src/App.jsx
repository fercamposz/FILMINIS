
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistroPage from "./pages/Registro";
import ListaFilmes from "./pages/ListaFilmes";
import AdicionarFilme from "./pages/AdicionarFilme";
import EditarFilme from "./pages/EditarFilme";
import DetalhesFilme from "./pages/DetalhesFilme";
import AdminPainel from "./pages/AdminPainel";

// tela 404
function NotFound() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>404 | Página Não Encontrada :( </h1>
      <p>A URL que você tentou acessar não existe.</p>
      <Navigate to="/" replace />
    </div>
  );
}

function LayoutWrapper({ children }) {
  const location = useLocation();

  const rotasSemLayout = ["/admin-painel"]; 
  const hideLayout = rotasSemLayout.some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <>
      {!hideLayout && <NavBar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}

function AppContent() {
  return (
    <LayoutWrapper>
      <Routes>
        {/* públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistroPage />} />
        <Route path="/filmes" element={<ListaFilmes />} />
        <Route path="/filmes/:id" element={<DetalhesFilme />} />

        {/* protegidas: precisa login */}
        <Route
          path="/adicionar"
          element={
            <ProtectedRoute>
              <AdicionarFilme />
            </ProtectedRoute>
          }
        />

        {/* editar filme */}
        <Route
          path="/filmes/:id/editar"
          element={
            <ProtectedRoute>
              <EditarFilme />
            </ProtectedRoute>
          }
        />

        {/* admin */}
        <Route
          path="/admin-painel"
          element={
            <AdminRoute>
              <AdminPainel />
            </AdminRoute>
          }
        />

        {/* redirecionamento curto */}
        <Route path="/add" element={<Navigate to="/adicionar" replace />} />

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LayoutWrapper>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
