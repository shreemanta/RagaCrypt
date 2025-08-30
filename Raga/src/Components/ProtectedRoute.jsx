import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">⏳ Checking session...</p>;
  }

  if (!currentUser) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    // Logged in but role mismatch
    return <Navigate to="/" replace />; // or show unauthorized page
  }

  return children;
};

export default ProtectedRoute;
