import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "../EncryptTech/EncryptTech.css";
import aesBg from "../assets/bg2.jpg";

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function stringToBuffer(str) {
  return new TextEncoder().encode(str);
}

function generateIV() {
  return window.crypto.getRandomValues(new Uint8Array(16)); // 16 bytes for AES-CBC
}

function bufferToHex(buffer) {
  return Array.from(buffer).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const AESEncrypt = () => {
  const [plaintext, setPlaintext] = useState("");
  const [password, setPassword] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [ivHex, setIvHex] = useState("");
  const [steps, setSteps] = useState([]);

  const handleEncrypt = async (e) => {
    e.preventDefault();
    try {
      const iv = generateIV();
      setIvHex(bufferToHex(iv));

      // Key derivation
      const pwBuffer = stringToBuffer(password);
      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        pwBuffer,
        "PBKDF2",
        false,
        ["deriveKey"]
      );

      const key = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: pwBuffer,
          iterations: 1000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-CBC", length: 256 },
        true,
        ["encrypt"]
      );

      // Encrypt
      const encBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        stringToBuffer(plaintext)
      );

      const cipherText = bufferToBase64(encBuffer);
      setFinalResult(cipherText);

      // Step explanation
      setSteps([
        { id: 1, content: `Plaintext converted to bytes.` },
        { id: 2, content: `Password "${password}" stretched into 256-bit key using PBKDF2.` },
        { id: 3, content: `Random IV generated: ${bufferToHex(iv)}.` },
        { id: 4, content: `AES-256-CBC encryption applied.` },
        { id: 5, content: `Ciphertext (Base64): ${cipherText}` },
      ]);
    } catch (err) {
      console.error(err);
      setFinalResult("⚠️ Encryption failed.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pad = 20;
    let y = 24;
    const lineGap = 8;
    const sectionGap = 14;

    const write = (txt, size = 11, color = [0, 0, 0]) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(txt, 170);
      lines.forEach((line) => {
        if (y > doc.internal.pageSize.height - 30) {
          doc.addPage();
          y = 24;
        }
        doc.text(line, pad, y);
        y += lineGap;
      });
    };

    const writeSectionTitle = (txt) => {
      doc.setFontSize(14);
      doc.setTextColor(17, 122, 101);
      doc.text(txt, pad, y);
      y += sectionGap;
      doc.setDrawColor(17, 122, 101);
      doc.setLineWidth(0.5);
      doc.line(pad, y - 7, 190 - pad, y - 7);
    };

    // Header
    doc.setDrawColor(46, 134, 193);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(pad - 5, y - 14, 170, 20, 3, 3, "F");
    doc.setFontSize(16);
    doc.setTextColor(46, 134, 193);
    doc.setFont("helvetica", "bold");
    doc.text("AES Cipher — Encryption Walkthrough", pad, y);
    y += 24;

    // Input Details
    writeSectionTitle("Input Details");
    write(`Plaintext: ${plaintext}`);
    write(`Password: ${password}`);
    write(`IV (Hex): ${ivHex}`);

    // Steps
    writeSectionTitle("Step-by-Step Process");
    steps.forEach((step) => write(`${step.id}. ${step.content}`));

    // Final Result
    writeSectionTitle("Final Cipher Text");
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    write(finalResult || "—");

    doc.save("AES_Encrypted.pdf");
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${aesBg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${finalResult ? "show-output" : ""}`}>
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 AES Encryption</h1>
            <form onSubmit={handleEncrypt} className="cipher-form">
              <input
                type="text"
                placeholder="Enter Plaintext"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Encrypt Message</button>
            </form>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Plaintext is converted to bytes. Password is stretched into a 256-bit key. AES-CBC encryption is applied with a random IV. Ciphertext is returned in Base64 format.
              </p>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for next technique?</p>
              <Link to="/encrypt/rsa" className="next-link">
                Go to RSA Encryption →
              </Link>
            </div>
          </div>
        </div>

        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔏 Encrypted Output</h2>
            <p><strong>Ciphertext (Base64):</strong> {finalResult}</p>
            <p><strong>IV (Hex):</strong> {ivHex}</p>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">{steps.map(step => <li key={step.id}>{step.content}</li>)}</ul>

            <button onClick={handleDownloadPDF} className="pdf-btn">📄 Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AESEncrypt;
