import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "../EncryptTech/EncryptTech.css";
import ctBg from "../assets/bg2.jpg";

const ColumnarDecrypt = () => {
  const [cipherText, setCipherText] = useState("");
  const [key, setKey] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [steps, setSteps] = useState([]);

  const handleDecrypt = (e) => {
    e.preventDefault();
    if (!key.match(/^[A-Za-z]+$/)) {
      setFinalResult("⚠️ Key must contain only letters.");
      return;
    }

    const upperCipher = cipherText.replace(/\s+/g, "").toUpperCase();
    const upperKey = key.toUpperCase();

    const cols = upperKey.length;
    const rows = Math.ceil(upperCipher.length / cols);
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(""));

    // Determine column order
    const sortedKey = upperKey.split("").map((ch, i) => ({ ch, i }));
    sortedKey.sort((a, b) => (a.ch > b.ch ? 1 : -1));

    // Fill columns in sorted key order
    let idx = 0;
    sortedKey.forEach(({ i }) => {
      for (let r = 0; r < rows; r++) {
        if (idx < upperCipher.length) {
          matrix[r][i] = upperCipher[idx];
          idx++;
        }
      }
    });

    // Explanation steps
    const explanationSteps = [
      { id: 1, content: `Ciphertext without spaces: ${upperCipher}` },
      { id: 2, content: `Key used for column order: ${upperKey}` },
      {
        id: 3,
        content: `Columns filled according to alphabetical order of key:`,
      },
    ];
    matrix.forEach((row, i) => {
      explanationSteps.push({
        id: explanationSteps.length + 1,
        content: `Row ${i + 1}: ${row.join(" ")}`,
      });
    });

    // Read row by row to get plaintext
    let result = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] !== "") result += matrix[r][c];
      }
    }
    explanationSteps.push({
      id: explanationSteps.length + 1,
      content: `Plaintext obtained by reading row by row: ${result}`,
    });

    setFinalResult(result);
    setSteps(explanationSteps);
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
    doc.text("Columnar Transposition Cipher — Decryption Walkthrough", pad, y);
    y += 24;

    writeSectionTitle("Input Details");
    write(`Ciphertext: ${cipherText}`);
    write(`Key: ${key}`);

    writeSectionTitle("Step-by-Step Process");
    steps.forEach((step) => write(`${step.id}. ${step.content}`));

    writeSectionTitle("Final Decrypted Message");
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    write(finalResult || "—");

    doc.save("ColumnarCipher_Decrypted.pdf");
  };

  return (
    <div className="cipher-page">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${ctBg})` }}
      ></div>
      <div className="cipher-overlay"></div>

      <div
        className={`cipher-content-wrapper ${finalResult ? "show-output" : ""}`}
      >
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔓 Columnar Transposition Decryption</h1>
            <form onSubmit={handleDecrypt} className="cipher-form">
              <input
                type="text"
                placeholder="Enter Ciphertext"
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Key (letters only)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Decrypt Message</button>
            </form>
            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                During decryption, the ciphertext is divided into columns
                according to the length of the key and arranged based on the
                alphabetical order of the key letters. These columns are filled
                with the ciphertext sequentially, and then the plaintext is
                reconstructed by reading the letters row by row from the matrix.
                This reverses the encryption process and restores the original
                message.
              </p>
            </section>
          </div>
        </div>

        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔏 Decrypted Output</h2>
            <p>
              <strong>Ciphertext:</strong> {cipherText}
            </p>
            <p>
              <strong>Key:</strong> {key}
            </p>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">
              {steps.map((step) => (
                <li key={step.id}>{step.content}</li>
              ))}
            </ul>

            <h3>✅ Final Decrypted Message:</h3>
            <div className="final-encryption-box">{finalResult}</div>
            <button onClick={handleDownloadPDF} className="pdf-btn">
              📄 Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnarDecrypt;
