import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "../EncryptTech/EncryptTech.css";
import ctBg from "../assets/bg2.jpg";

const ColumnarEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [finalResult, setFinalResult] = useState("");
  const [steps, setSteps] = useState([]);

  const handleEncrypt = (e) => {
    e.preventDefault();
    if (!key.match(/^[A-Za-z]+$/)) {
      setFinalResult("⚠️ Key must contain only letters.");
      return;
    }

    const upperMessage = message.replace(/\s+/g, "").toUpperCase();
    const upperKey = key.toUpperCase();

    // Create columns
    const cols = upperKey.length;
    const rows = Math.ceil(upperMessage.length / cols);
    const matrix = Array.from({ length: rows }, () =>
      Array(cols).fill("")
    );

    // Fill matrix row by row
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (idx < upperMessage.length) {
          matrix[r][c] = upperMessage[idx];
          idx++;
        }
      }
    }

    // Step explanation
    const explanationSteps = [
      { id: 1, content: `Message without spaces: ${upperMessage}` },
      { id: 2, content: `Key for column order: ${upperKey}` },
      { id: 3, content: `Message filled in matrix row by row:` },
    ];
    matrix.forEach((row, i) => {
      explanationSteps.push({
        id: explanationSteps.length + 1,
        content: `Row ${i + 1}: ${row.join(" ")}`,
      });
    });

    // Determine column order
    const sortedKey = upperKey.split("").map((ch, i) => ({ ch, i }));
    sortedKey.sort((a, b) => (a.ch > b.ch ? 1 : -1));

    // Read columns in key order
    let result = "";
    sortedKey.forEach(({ i }, colIdx) => {
      for (let r = 0; r < rows; r++) {
        if (matrix[r][i] !== "") result += matrix[r][i];
      }
      explanationSteps.push({
        id: explanationSteps.length + 1,
        content: `Read column ${colIdx + 1} (original index ${i}): adds "${matrix.map(r=>r[i]).join("")}"`,
      });
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
    doc.text("Columnar Transposition Cipher — Encryption Walkthrough", pad, y);
    y += 24;

    writeSectionTitle("Input Details");
    write(`Message: ${message}`);
    write(`Key: ${key}`);

    writeSectionTitle("Step-by-Step Process");
    steps.forEach((step) => write(`${step.id}. ${step.content}`));

    writeSectionTitle("Final Encrypted Message");
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    write(finalResult || "—");

    doc.save("ColumnarCipher.pdf");
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${ctBg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${finalResult ? "show-output" : ""}`}>
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Columnar Transposition Cipher</h1>
            <form onSubmit={handleEncrypt} className="cipher-form">
              <input
                type="text"
                placeholder="Enter Plaintext"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Enter Key (letters only)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Encrypt Message</button>
            </form>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                The message is written in rows of length equal to the key. Columns are then read in the alphabetical order of the key letters to form the ciphertext.
              </p>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/next" className="next-link">
                Try Next Cipher →
              </Link>
            </div>
          </div>
        </div>

        {finalResult && (
          <div className="right-section white-output-box">
            <h2>🔏 Encrypted Output</h2>
            <p><strong>Original Message:</strong> {message}</p>
            <p><strong>Key:</strong> {key}</p>

            <h3>🧠 Step-by-Step Explanation</h3>
            <ul className="step-list">
              {steps.map(step => <li key={step.id}>{step.content}</li>)}
            </ul>

            <h3>✅ Final Encrypted Message:</h3>
            <div className="final-encryption-box">{finalResult}</div>
            <button onClick={handleDownloadPDF} className="pdf-btn">📄 Download PDF</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnarEncrypt;
