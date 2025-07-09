import { Routes, Route } from "react-router-dom";
import './index.css'
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Encrypt from "./Pages/Encrypt";
import Decrypt from "./Pages/Decrypt";
import History from "./Pages/History";
import Profile from "./Pages/Profile";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
