import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { apiLogin } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { role: payload.role, username: payload.username };
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate();
  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.token) {
        Cookies.set("token", response.token);

        try {
          const payload = JSON.parse(atob(response.token.split(".")[1]));
          setUser({ role: payload.role, username: payload.username });
          if (payload.role === "Admin") {
            navigate("/admin");
          } else if (payload.role === "User") {
            navigate("/user");
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          Cookies.remove("token");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
