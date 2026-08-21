// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [idcobrador, setIdcobrador] = useState(localStorage.getItem("idcobrador"));

  const login = (token, username, idcobrador) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("idcobrador", idcobrador);
    setToken(token);
    setUsername(username);
    setIdcobrador(idcobrador);
  };

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("idcobrador");
  setToken(null);
  setUsername(null);
  setIdcobrador(null);
};

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated , username , idcobrador}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
