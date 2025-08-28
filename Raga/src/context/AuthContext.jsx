import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ✅ Use consistent named exports
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined); // undefined while loading

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
  }, []);

  const login = (userData) => {
    const expiry = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2h

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
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named export
export const useAuth = () => useContext(AuthContext);
