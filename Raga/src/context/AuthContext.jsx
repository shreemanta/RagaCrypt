import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("expiry");

    if (storedUser && token && expiry && new Date() < new Date(expiry)) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expiry");
      setCurrentUser(null);
    }

    setLoading(false); // ✅ Done loading
  }, []);

  const login = (userData) => {
    const expiry = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour fixed session
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("expiry", expiry.toISOString());
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {children} {/* ✅ This is where your app content goes */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
