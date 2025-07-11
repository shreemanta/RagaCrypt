import { Routes, Route } from "react-router-dom";
import './index.css'
import RegistrationForm from "./Pages/RegistrationForm";
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
import RegistrationForm from "./Pages/RegistrationForm";
// Encryption Techniques
import CaesarEncrypt from "./EncryptTech/CaeserEncrypt";
import VigenereEncrypt from "./EncryptTech/VigenereEncrypt";
import RailFenceEncrypt from "./EncryptTech/RailFenceEncrypt";
import MonoalphabeticEncrypt from "./EncryptTech/MonoAlphabeticEncrypt";
import PlayfairEncrypt from "./EncryptTech/PlayFairEncrypt";
import HillEncrypt from "./EncryptTech/HillEncrypt";

// Decryption Techniques
import CaesarDecrypt from "./DecryptTech/CaesarDecrypt";
import VigenereDecrypt from "./DecryptTech/VigenereDecrypt";
import RailFenceDecrypt from "./DecryptTech/RailFenceDecrypt";
import MonoalphabeticDecrypt from "./DecryptTech/MonoAlphabeticDecrypt";
import PlayfairDecrypt from "./DecryptTech/PlayfairDecrypt";
import HillDecrypt from "./DecryptTech/HillDecrypt";

function App() {
  return (
    <>
     
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<RegistrationForm />} />

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
        <Route
          path="/encrypt/caesar"
          element={
            <ProtectedRoute>
              <CaesarEncrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encrypt/vigenere"
          element={
            <ProtectedRoute>
              <VigenereEncrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encrypt/railfence"
          element={
            <ProtectedRoute>
              <RailFenceEncrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encrypt/monoalphabetic"
          element={
            <ProtectedRoute>
              <MonoalphabeticEncrypt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/encrypt/playfair"
          element={
            <ProtectedRoute>
              <PlayfairEncrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/encrypt/hill"
          element={
            <ProtectedRoute>
              <HillEncrypt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/decrypt/caesar"
          element={
            <ProtectedRoute>
              <CaesarDecrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decrypt/vigenere"
          element={
            <ProtectedRoute>
              <VigenereDecrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decrypt/railfence"
          element={
            <ProtectedRoute>
              <RailFenceDecrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decrypt/monoalphabetic"
          element={
            <ProtectedRoute>
              <MonoalphabeticDecrypt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/decrypt/playfair"
          element={
            <ProtectedRoute>
              <PlayfairDecrypt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decrypt/hill"
          element={
            <ProtectedRoute>
              <HillDecrypt />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
export default App;