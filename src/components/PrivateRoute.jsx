import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";


const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  const token = Cookies.get("token");
  if (token && user && user.role === role) {
    return children;
  }
  return <Navigate to="/" />;
};

export default PrivateRoute;
