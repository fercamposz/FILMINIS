import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // estado interno
  const [user, setUser] = useState(null);         
  const [isAdmin, setIsAdmin] = useState(false);   
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // carrega informações salvas no navegador
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("usuario");

    if (token && userStr) {
      const usuario = JSON.parse(userStr);
      setUser(usuario);
      setIsAuthenticated(true);
      setIsAdmin(usuario.role === "admin");
    }
  }, []);

  // login faz chamada pro backend e salva tudo
  const login = async (username, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) return null; 

      // salva no localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify({ username: data.username, role: data.role })
      );

      // atualiza estados
      setUser({ username: data.username, role: data.role });
      setIsAuthenticated(true);
      setIsAdmin(data.role === "admin");

      return data.role; 
    } catch (error) {
      console.error("Erro no login:", error);
      return null;
    }
  };

  // limpar tudo e deslogar
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
