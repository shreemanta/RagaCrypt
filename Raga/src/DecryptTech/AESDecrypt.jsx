import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "../EncryptTech/EncryptTech.css";
import aesBg from "../assets/bg2.jpg";

function hexToBuffer(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
}

function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bufferToString(buffer) {
  return new TextDecoder().decode(buffer);
}

const AESDecrypt = () => {
  const [cipherText, setCipherText] = useState("");
  const [password, setPassword] = useState("");
  const [iv, setIv] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [steps, setSteps] = useState([]);

  const handleDecrypt = async (e) => {
    e.preventDefault();
    try {
      const pwBuffer = new TextEncoder().encode(password);
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
        ["decrypt"]
      );

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv: hexToBuffer(iv) },
        key,
        base64ToBuffer(cipherText)
      );

      const plaintext = bufferToString(decryptedBuffer);
      setFinalResult(plaintext);

      setSteps([
        { id: 1, content: `Ciphertext converted from Base64 to bytes.` },
        {
          id: 2,
          content: `Password "${password}" stretched into 256-bit key using PBKDF2.`,
        },
        { id: 3, content: `IV (Hex) converted to bytes: ${iv}` },
        { id: 4, content: `AES-256-CBC decryption applied.` },
        { id: 5, content: `Plaintext result: ${plaintext}` },
      ]);
    } catch (err) {
      console.error(err);
      setFinalResult(
        "⚠️ Decryption failed. Check Ciphertext, Password, and IV."
      );
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

    doc.setDrawColor(46, 134, 193);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(pad - 5, y - 14, 170, 20, 3, 3, "F");
    doc.setFontSize(16);
    doc.setTextColor(46, 134, 193);
    doc.setFont("helvetica", "bold");
    doc.text("AES Cipher — Decryption Walkthrough", pad, y);
    y += 24;

    // Input
    writeSectionTitle("Input Details");
    write(`Ciphertext (Base64): ${cipherText}`);
    write(`Password: ${password}`);
    write(`IV (Hex): ${iv}`);

    // Steps
    writeSectionTitle("Step-by-Step Process");
    steps.forEach((step) => write(`${step.id}. ${step.content}`));

    // Result
    writeSectionTitle("Final Decrypted Message");
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    write(finalResult || "—");

    doc.save("AES_Decrypted.pdf");
  };

  return (
    <div className="cipher-page">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${aesBg})` }}
      ></div>
      <div className="cipher-overlay"></div>

      <div className="cipher-content-wrapper show-output">
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔓 AES Decryption</h1>
            <form onSubmit={handleDecrypt} className="cipher-form">
              <input
                type="text"
                placeholder="Ciphertext (Base64)"
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="IV (Hex from Encryption)"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                required
              />
              <button type="submit">Decrypt Message</button>
            </form>
            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                AES Decryption is the process of converting an encrypted message
                (ciphertext) back into its original readable form (plaintext)
                using the same key and Initialization Vector (IV) that were used
                during encryption. The user provides the ciphertext, password,
                and IV; the password is stretched into a 256-bit key using
                PBKDF2, and the IV is converted from hex to bytes. AES in CBC
                mode then reverses the encryption process, transforming the
                ciphertext bytes back into plaintext, which is finally decoded
                into a readable string. This ensures the original message is
                accurately restored.
              </p>
            </section>
            <div className="next-technique">
              <p>➡️ Ready for next technique?</p>
              <Link to="/decrypt/rsa" className="next-link">
                Go to RSA Decryption →
              </Link>
            </div>
          </div>
        </div>

        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔏 Decrypted Output</h2>
            <div className="final-encryption-box">{finalResult}</div>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">
              {steps.map((step) => (
                <li key={step.id}>{step.content}</li>
              ))}
            </ul>

            <button onClick={handleDownloadPDF} className="pdf-btn">
              📄 Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AESDecrypt;
