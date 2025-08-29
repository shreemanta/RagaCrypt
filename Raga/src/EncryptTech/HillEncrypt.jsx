import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import hillBg from "../assets/bg2.jpg";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const mod = (n, m) => ((n % m) + m) % m;

const HillEncrypt = () => {
  const [message, setMessage] = useState("");
  const [matrixSize, setMatrixSize] = useState(2); // default 2x2
  const [keyMatrix, setKeyMatrix] = useState(Array(4).fill(""));
  const [output, setOutput] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  // --- Helpers ---
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setMatrixSize(size);
    setKeyMatrix(Array(size * size).fill(""));
  };

  const handleEncrypt = (e) => {
    e.preventDefault();
    const cleanMsg = message.toUpperCase().replace(/[^A-Z]/g, "");
    const matrix = keyMatrix.map(Number);

    if (matrix.some(isNaN)) {
      setOutput("⚠️ Please enter only numbers in the matrix.");
      setSlides([
        <div className="slide-card" key="err">
          <h3>⚠️ Invalid Matrix</h3>
          <p>Please provide only numbers for the key matrix.</p>
        </div>,
      ]);
      setShowOutput(true);
      return;
    }

    // reshape matrix
    const mat = [];
    for (let i = 0; i < matrixSize; i++) {
      mat.push(matrix.slice(i * matrixSize, (i + 1) * matrixSize));
    }

    // make chunks
    const chunks = [];
    for (let i = 0; i < cleanMsg.length; i += matrixSize) {
      let chunk = cleanMsg.slice(i, i + matrixSize);
      while (chunk.length < matrixSize) chunk += "X"; // padding
      chunks.push(chunk);
    }

    // encrypt with details
    const encryptedChunks = [];
    const slidesArr = [];

    slidesArr.push(
      <div className="slide-card" key="intro">
        <h3>Step 1 — Prepare Message</h3>
        <p>
          Convert to uppercase, remove spaces/punctuation, and pad with X to fit{" "}
          {matrixSize}-letter blocks.
        </p>
        <p>
          <strong>Cleaned:</strong> {cleanMsg}
        </p>
        <p>
          <strong>Blocks:</strong> {chunks.join(" | ")}
        </p>
      </div>
    );

    slidesArr.push(
      <div className="slide-card" key="matrix">
        <h3>Step 2 — Key Matrix</h3>
        <p>The key matrix you entered is used for multiplication.</p>
        <div className="matrix-grid">
          {mat.map((row, r) => (
            <div className="matrix-row" key={r}>
              {row.map((val, c) => (
                <span className="matrix-cell" key={c}>
                  {val}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    chunks.forEach((group, idx) => {
      const vector = group.split("").map((c) => c.charCodeAt(0) - 65);
      const result = mat.map((row) =>
        row.reduce((sum, num, i) => sum + num * vector[i], 0)
      );
      const enc = result
        .map((val) => String.fromCharCode(mod(val, 26) + 65))
        .join("");
      encryptedChunks.push(enc);

      slidesArr.push(
        <div className="slide-card" key={`block-${idx}`}>
          <h3>
            Step {idx + 3} — Encrypt Block {idx + 1}
          </h3>
          <p>
            <strong>Block:</strong> {group}
          </p>
          <p>
            <strong>Vector:</strong> [{vector.join(", ")}]
          </p>
          <p>
            <strong>Multiply:</strong> Key × Vector = [{result.join(", ")}]
          </p>
          <p>
            <strong>Modulo 26:</strong> [
            {result.map((v) => mod(v, 26)).join(", ")}]
          </p>
          <p>
            <strong>Encrypted:</strong> {enc}
          </p>
        </div>
      );
    });

    slidesArr.push(
      <div className="slide-card" key="final">
        <h3>✅ Final Encrypted Message</h3>
        <div className="final-encryption-box">{encryptedChunks.join("")}</div>
      </div>
    );

    setOutput(encryptedChunks.join(""));
    setSlides(slidesArr);
    setCurrentSlide(0);
    setShowOutput(true);
  };

  const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    const pad = 12;            // left margin
    let y = 16;                // cursor Y
    const lineGap = 8;
    const sectionGap = 12;

    // helpers
    const write = (txt, size = 11, color = [0,0,0]) => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(txt, 180);
      lines.forEach(line => {
        if (y > 280) { doc.addPage(); y = 16; }
        doc.text(line, pad, y);
        y += lineGap;
      });
    };

    const writeSectionTitle = (txt) => {
      if (y + 10 > 285) { doc.addPage(); y = 16; }
      doc.setFontSize(14);
      doc.setTextColor(17, 122, 101); // teal
      doc.text(txt, pad, y);
      y += sectionGap;
      doc.setDrawColor(17, 122, 101);
      doc.setLineWidth(0.5);
      doc.line(pad, y - 7, 200 - pad, y - 7);
    };

    const writeTag = (label, value) => {
      if (y + 8 > 285) { doc.addPage(); y = 16; }
      doc.setFontSize(11);
      doc.setTextColor(90, 90, 90);
      doc.text(`${label}:`, pad, y);
      doc.setTextColor(0,0,0);
      doc.text(value, pad + 28, y);
      y += lineGap;
    };

    const drawMatrix = (mat) => {
      const cellW = 18, cellH = 10;
      const startX = pad, startY = y;
      doc.setDrawColor(180,180,180);
      mat.forEach((row, r) => {
        row.forEach((v, c) => {
          const x = startX + c*cellW;
          const yy = startY + r*cellH;
          doc.roundedRect(x, yy, cellW, cellH, 1, 1);
          doc.setFontSize(11);
          doc.setTextColor(0,0,0);
          doc.text(String(v), x + cellW/2, yy + 7, { align: "center" });
        });
      });
      y += mat.length * cellH + sectionGap/2;
    };

    // --------- build data from current state ----------
    const size = matrixSize;
    const cleanMsg = (message || "").toUpperCase().replace(/[^A-Z]/g, "");
    // key matrix
    const mat = [];
    const numericKey = keyMatrix.map(n => Number(n));
    for (let i = 0; i < size; i++) {
      mat.push(numericKey.slice(i*size, (i+1)*size));
    }
    // blocks
    const chunks = [];
    for (let i = 0; i < cleanMsg.length; i += size) {
      let chunk = cleanMsg.slice(i, i + size);
      while (chunk.length < size) chunk += "X";
      chunks.push(chunk);
    }

    // --------- document body ----------
    // Header card
    doc.setDrawColor(46, 134, 193);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(pad-4, y-8, 200 - 2*pad + 8, 18, 2, 2, "F");
    doc.setFontSize(16);
    doc.setTextColor(46, 134, 193);
    doc.text(" Hill Cipher — Trendy Walkthrough", pad, y + 4);
    y += 24;

    writeTag("Plaintext", cleanMsg || "(empty)");
    writeTag("Matrix Size", `${size} × ${size}`);

    writeSectionTitle(" Key Matrix");
    drawMatrix(mat);

    writeSectionTitle(" Step 1 — Prepare Message");
    write("• Uppercase, remove spaces/punctuation.");
    write("• Pad with X to fit blocks.");
    writeTag("Blocks", chunks.length ? chunks.join(" | ") : "—");

    writeSectionTitle(" Step 2 — Encrypt Each Block");
    write("For each block: Vector = letters → numbers (A=0..Z=25).");
    write("Compute: CipherVector = (Key × Vector) mod 26.");
    write("Map numbers back to letters to get the encrypted block.");

    const encryptedChunks = [];

    chunks.forEach((group, idx) => {
      if (y + 40 > 285) { doc.addPage(); y = 16; }
      doc.setFontSize(12);
      doc.setTextColor(52, 73, 94);
      doc.text(`Block ${idx + 1}: ${group}`, pad, y);
      y += lineGap;

      // vector
      const v = group.split("").map(ch => ch.charCodeAt(0) - 65);
      write(`Vector: [${v.join(", ")}]`);

      // multiply
      const multiplied = mat.map(row =>
        row.reduce((sum, k, i) => sum + (k * v[i]), 0)
      );
      write(`Key × Vector = [${multiplied.join(", ")}]`);

      // mod
      const modded = multiplied.map(n => mod(n, 26));
      write(`mod 26 ⇒ [${modded.join(", ")}]`);

      // back to letters
      const enc = modded.map(n => String.fromCharCode(65 + n)).join("");
      encryptedChunks.push(enc);
      write(`Encrypted Block: ${enc}`, 11, [0, 128, 0]);

      // pretty formula lines (trend!)
      if (size === 2) {
        const f1 = `${mat[0][0]}*${v[0]} + ${mat[0][1]}*${v[1]}  ≡  ${multiplied[0]}  ≡  ${modded[0]} (mod 26)`;
        const f2 = `${mat[1][0]}*${v[0]} + ${mat[1][1]}*${v[1]}  ≡  ${multiplied[1]}  ≡  ${modded[1]} (mod 26)`;
        write(`Formulas:`, 11, [120, 120, 120]);
        write(`• Row1 · Vec → ${f1}`);
        write(`• Row2 · Vec → ${f2}`);
      } else if (size === 3) {
        const f1 = `${mat[0][0]}*${v[0]} + ${mat[0][1]}*${v[1]} + ${mat[0][2]}*${v[2]}  ≡  ${multiplied[0]}  ≡  ${modded[0]} (mod 26)`;
        const f2 = `${mat[1][0]}*${v[0]} + ${mat[1][1]}*${v[1]} + ${mat[1][2]}*${v[2]}  ≡  ${multiplied[1]}  ≡  ${modded[1]} (mod 26)`;
        const f3 = `${mat[2][0]}*${v[0]} + ${mat[2][1]}*${v[1]} + ${mat[2][2]}*${v[2]}  ≡  ${multiplied[2]}  ≡  ${modded[2]} (mod 26)`;
        write(`Formulas:`, 11, [120, 120, 120]);
        write(`• Row1 · Vec → ${f1}`);
        write(`• Row2 · Vec → ${f2}`);
        write(`• Row3 · Vec → ${f3}`);
      }

      y += 4; // little breathing space
    });

    writeSectionTitle("Final Ciphertext");
    write(encryptedChunks.join(""), 14, [0, 0, 0]);

    // footer
    if (y + 16 > 285) { doc.addPage(); y = 16; }
    y = 290;
    doc.setFontSize(9);
    doc.setTextColor(120,120,120);
    doc.text("Generated by RagaCrypt • Hill Cipher (Matrix Crypto Vibes ✨)", pad, 290);

    doc.save("HillCipher.pdf");
  } catch (err) {
    console.error(err);
    alert("PDF generation failed. Check console for details.");
  }
};


  // slider controls
  const prev = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const next = () => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1));
  const goto = (i) => setCurrentSlide(i);

  return (
    <div className="cipher-page">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${hillBg})` }}
      />
      <div className="cipher-overlay"></div>

      <div
        className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}
      >
        {/* Left Section — original content */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Hill Cipher Encryption (2×2 or 3×3)</h1>
            <p>
              Choose a matrix size, enter your key matrix, and encrypt your
              message.
            </p>

            <form onSubmit={handleEncrypt} className="cipher-form">
              <label>
                Matrix Size:
                <select value={matrixSize} onChange={handleSizeChange}>
                  <option value={2}>2 × 2</option>
                  <option value={3}>3 × 3</option>
                </select>
              </label>

              <input
                type="text"
                placeholder="Enter Plaintext"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <div
                className="matrix-inputs"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${matrixSize}, 1fr)`,
                  gap: "0.5rem",
                }}
              >
                {keyMatrix.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`K${idx + 1}`}
                    value={val}
                    onChange={(e) => {
                      const updated = [...keyMatrix];
                      updated[idx] = e.target.value;
                      setKeyMatrix(updated);
                    }}
                  />
                ))}
              </div>

              <button type="submit">Encrypt</button>
            </form>

            <div className="output-section">
              <h3>🔏 Encrypted Output</h3>
              <div className="output-box">{output}</div>
            </div>

            <div className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Hill cipher encrypts blocks of letters using matrix
                multiplication and modular arithmetic. Each letter is converted
                to a number (A=0 to Z=25). The message is processed in blocks
                matching your matrix size and multiplied by your key matrix. The
                resulting numbers are converted back to letters using mod 26.
              </p>
            </div>
            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/aes" className="next-link">
                Try AES Technique →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section — Slides */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Step-by-Step (every block)</h2>

            <div className="white-output-box">
              {slides.length > 0 && (
                <>
                  <div className="step-slider" style={{ marginTop: 12 }}>
                    <div className="slide-card">{slides[currentSlide]}</div>

                    <div className="slider-controls" style={{ marginTop: 10 }}>
                      <button onClick={prev} disabled={currentSlide === 0}>
                        ◀ Prev
                      </button>
                      <span>
                        {" "}
                        Slide {currentSlide + 1} / {slides.length}{" "}
                      </span>
                      <button
                        onClick={next}
                        disabled={currentSlide === slides.length - 1}
                      >
                        Next ▶
                      </button>
                    </div>

                    <div className="slider-dots" style={{ marginTop: 8 }}>
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${
                            i === currentSlide ? "active" : ""
                          }`}
                          onClick={() => goto(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 999,
                            margin: 4,
                            border: "none",
                            background: i === currentSlide ? "#00b894" : "#bbb",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              <button onClick={downloadPDF} style={{ marginTop: "10px" }}>
                ⬇ Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HillEncrypt;
