import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) return null; // still loading

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
