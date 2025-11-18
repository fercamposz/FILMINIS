
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// rota que exige apenas estar logado
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Carregando...</div>;  

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />; 

  return children; // autorizado
};

// rota exclusiva para admin
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Carregando...</div>;   

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />; 

  if (!isAdmin) {
    alert("Acesso Negado: Você precisa ser um administrador.");
    return <Navigate to="/" replace />; 
  }

  return children; // admin liberado
};
