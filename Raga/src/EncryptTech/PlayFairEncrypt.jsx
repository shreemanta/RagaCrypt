import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import pfBg from "../assets/bg2.jpg";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

// --- Helper: build Playfair matrix ---
const buildMatrix = (key) => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // J excluded
  const seen = new Set();
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
  const matrixArr = [];

  (cleanKey + alphabet).split("").forEach((ch) => {
    if (!seen.has(ch)) {
      seen.add(ch);
      matrixArr.push(ch);
    }
  });

  // reshape 5x5
  const matrix = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(matrixArr.slice(i * 5, (i + 1) * 5));
  }
  return matrix;
};

// --- Helper: find coordinates ---
const findPos = (matrix, ch) => {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === ch) return { r, c };
    }
  }
  return null;
};

// --- Playfair Encrypt with details ---
const encryptDetailed = (text, key) => {
  const matrix = buildMatrix(key);
  const clean = text.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");

  // form digraphs
  const pairs = [];
  for (let i = 0; i < clean.length; i += 2) {
    let a = clean[i];
    let b = clean[i + 1];
    if (!b) b = "X";
    if (a === b) {
      b = "X";
      i--; // reprocess next letter
    }
    pairs.push([a, b]);
  }

  const cipherPairs = [];
  const steps = [];

  pairs.forEach(([a, b], idx) => {
    const pa = findPos(matrix, a);
    const pb = findPos(matrix, b);
    let rule = "";
    let encA, encB;

    if (pa.r === pb.r) {
      // same row
      rule = "Same Row → shift right";
      encA = matrix[pa.r][(pa.c + 1) % 5];
      encB = matrix[pb.r][(pb.c + 1) % 5];
    } else if (pa.c === pb.c) {
      // same column
      rule = "Same Column → shift down";
      encA = matrix[(pa.r + 1) % 5][pa.c];
      encB = matrix[(pb.r + 1) % 5][pb.c];
    } else {
      // rectangle
      rule = "Rectangle → swap columns";
      encA = matrix[pa.r][pb.c];
      encB = matrix[pb.r][pa.c];
    }

    cipherPairs.push(encA + encB);

    steps.push(
      <div className="slide-card" key={`pair-${idx}`}>
        <h3>Step {idx + 2} — Encrypt Pair {idx + 1}</h3>
        <p><strong>Pair:</strong> {a}{b}</p>
        <p><strong>Rule:</strong> {rule}</p>
        <p><strong>Encrypted:</strong> {encA}{encB}</p>
      </div>
    );
  });

  return { matrix, pairs, cipher: cipherPairs.join(""), slides: steps };
};

const PlayfairEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const handleEncrypt = (e) => {
    e.preventDefault();
    const { matrix, pairs, cipher, slides } = encryptDetailed(message, key);

    // intro slide
    const intro = (
      <div className="slide-card" key="intro">
        <h3>Step 1 — Prepare Message</h3>
        <p>Uppercase, replace J→I, split into digraphs (insert X for repeats).</p>
        <p><strong>Plaintext:</strong> {message.toUpperCase()}</p>
        <p><strong>Pairs:</strong> {pairs.map(p => p.join("")).join(" | ")}</p>
      </div>
    );

    // matrix slide
    const matrixSlide = (
      <div className="slide-card" key="matrix">
        <h3>Playfair Matrix</h3>
        <div className="matrix-grid">
          {matrix.map((row, r) => (
            <div className="matrix-row" key={r}>
              {row.map((val, c) => (
                <span className="matrix-cell" key={c}>{val}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );

    // final slide
    const final = (
      <div className="slide-card" key="final">
        <h3>✅ Final Encrypted Message</h3>
        <div className="final-encryption-box">{cipher}</div>
      </div>
    );

    setOutput(cipher);
    setSlides([intro, matrixSlide, ...slides, final]);
    setCurrentSlide(0);
    setShowOutput(true);
  };

const downloadPDF = () => {
  try {
    const doc = new jsPDF();
    const pad = 12;
    const lineGap = 8;
    const sectionGap = 12;
    let y = 16;

    // Assuming these functions exist in your code
    const matrix = buildMatrix(key);
    const { pairs, cipher } = encryptDetailed(message, key);

    // ---------- HELPERS ----------
    const write = (txt, size = 11, color = [0, 0, 0]) => {
      doc.setFont("helvetica", "normal");
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
      doc.setFont("helvetica", "bold");
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
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(90, 90, 90);
      doc.text(`${label}:`, pad, y);
      doc.setTextColor(0, 0, 0);
      doc.text(value, pad + 28, y);
      y += lineGap;
    };

    // ---------- HEADER ----------
    doc.setDrawColor(46, 134, 193);
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(pad-4, y-8, 200 - 2*pad + 8, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(46, 134, 193);
    doc.text("Playfair Cipher — Trendy Walkthrough", pad, y + 4);
    y += 24;

    // ---------- INPUT DETAILS ----------
    writeTag("Plaintext", message.toUpperCase() || "(empty)");
    writeTag("Key", key.toUpperCase() || "(empty)");

    // ---------- KEY MATRIX ----------
    writeSectionTitle("Key Matrix");
    matrix.forEach(row => write(row.join(" "), 11, [0, 0, 0]));

    // ---------- STEP-BY-STEP ----------
    writeSectionTitle("Step-by-Step Encryption");
    pairs.forEach(([a, b], idx) => {
      write(`Block ${idx + 1}: ${a}${b} → Encryption rule applied`);
    });

    // ---------- FINAL CIPHERTEXT ----------
    writeSectionTitle("Final Ciphertext");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // green like Hill Cipher
    write(cipher || "—");

    // ---------- FOOTER ----------
    if (y + 16 > 285) { doc.addPage(); y = 16; }
    y = 290;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Generated by RagaCrypt • Playfair Cipher", pad, y);

    doc.save("PlayfairCipher.pdf");
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("PDF generation failed. Check console for details.");
  }
};


  const prev = () => setCurrentSlide(s => Math.max(0, s - 1));
  const next = () => setCurrentSlide(s => Math.min(slides.length - 1, s + 1));
  const goto = (i) => setCurrentSlide(i);

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${pfBg})` }}/>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* Left */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Playfair Cipher Encryption</h1>
            <p>Enter a keyword and message to encrypt with Playfair.</p>

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
                placeholder="Enter Keyword"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Encrypt</button>
            </form>

            <div className="output-section">
              <h3>🔏 Encrypted Output</h3>
              <div className="output-box">{output}</div>
            </div>

            <div className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Playfair uses a 5×5 grid built from your keyword. Message is split
                into pairs, and each pair is encrypted based on its position in
                the grid (row, column, or rectangle rule).
              </p>
            </div>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/hill" className="next-link">
                Try Hill Cipher →
              </Link>
            </div>
          </div>
        </div>

        {/* Right — Slides */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Step-by-Step (digraphs)</h2>
            <div className="white-output-box">
              {slides.length > 0 && (
                <>
                  <div className="step-slider">
                    <div className="slide-card">{slides[currentSlide]}</div>
                    <div className="slider-controls">
                      <button onClick={prev} disabled={currentSlide === 0}>◀ Prev</button>
                      <span> Slide {currentSlide+1} / {slides.length} </span>
                      <button onClick={next} disabled={currentSlide === slides.length-1}>Next ▶</button>
                    </div>
                    <div className="slider-dots">
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${i===currentSlide ? "active":""}`}
                          onClick={() => goto(i)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              <button onClick={downloadPDF} style={{ marginTop: "10px" }}>⬇ Download PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairEncrypt;
