import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">⏳ Checking session...</p>;
  }

if (currentUser === undefined) {
  // Show loading spinner or blank until context loads
  return null;
}


  return children;
};

export default ProtectedRoute;
