// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // Wait until login state is determined
  if (isLoggedIn === null) return null;

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
