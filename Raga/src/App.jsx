import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import History from "./Pages/History";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import Profile from "./Pages/Profile";
import Encrypt from "./Pages/Encrypt";
import Decrypt from "./Pages/Decrypt";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encrypt"
          element={
            <ProtectedRoute>
              <Encrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decrypt"
          element={
            <ProtectedRoute>
              <Decrypt />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
