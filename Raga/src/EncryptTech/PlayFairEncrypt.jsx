import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import playfairBg from "../assets/bg2.jpg";
import { Link } from "react-router-dom";

const PlayfairEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [matrix, setMatrix] = useState([]);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  // --- Helpers ---
  const generateMatrix = (keyword) => {
    const k = (keyword || "").toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    const order = k + "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const seen = new Set();
    const flat = [];
    for (const ch of order) {
      if (!seen.has(ch)) {
        seen.add(ch);
        flat.push(ch);
      }
    }
    const grid = [];
    for (let r = 0; r < 5; r++) grid.push(flat.slice(r * 5, r * 5 + 5));
    return grid;
  };

  const findPos = (grid, ch) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] === ch) return [r, c];
      }
    }
    return [-1, -1];
  };

  // Preprocess and also mark inserted X's
  // returns { cleaned, pairs } where pairs is [{a:{char, inserted}, b:{char, inserted}} ...]
  const preprocessDetailed = (text) => {
    const up = (text || "").toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    const pairs = [];
    let i = 0;
    while (i < up.length) {
      const a = up[i];
      const b = up[i + 1];
      if (!b) {
        pairs.push({ a: { char: a, inserted: false }, b: { char: "X", inserted: true } });
        i += 1;
      } else if (a === b) {
        pairs.push({ a: { char: a, inserted: false }, b: { char: "X", inserted: true } });
        i += 1; // only advance 1 to re-evaluate the next letter in next iteration
      } else {
        pairs.push({ a: { char: a, inserted: false }, b: { char: b, inserted: false } });
        i += 2;
      }
    }
    const cleaned = pairs.map(p => p.a.char + p.b.char).join("");
    return { cleaned, pairs };
  };

  const encryptDetailed = (text, keyWord) => {
    const grid = generateMatrix(keyWord);
    const { cleaned, pairs } = preprocessDetailed(text);
    const cipherPairs = [];
    const perLetter = []; // will hold objects for each letter in order (for slides)

    for (let idx = 0; idx < pairs.length; idx++) {
      const p = pairs[idx];
      const a = p.a.char;
      const b = p.b.char;
      const [r1, c1] = findPos(grid, a);
      const [r2, c2] = findPos(grid, b);

      let encA = "", encB = "", rule = "";

      if (r1 === r2) {
        // same row: move right
        encA = grid[r1][(c1 + 1) % 5];
        encB = grid[r2][(c2 + 1) % 5];
        rule = "same-row";
      } else if (c1 === c2) {
        // same column: move down
        encA = grid[(r1 + 1) % 5][c1];
        encB = grid[(r2 + 1) % 5][c2];
        rule = "same-col";
      } else {
        // rectangle
        encA = grid[r1][c2];
        encB = grid[r2][c1];
        rule = "rectangle";
      }

      cipherPairs.push(encA + encB);

      // create per-letter entries (first letter of pair)
      perLetter.push({
        original: a,
        inserted: p.a.inserted,
        pairWith: b,
        pairIndex: idx,
        pos: { row: r1, col: c1 },
        enc: encA,
        rule,
      });

      // second letter of pair
      perLetter.push({
        original: b,
        inserted: p.b.inserted,
        pairWith: a,
        pairIndex: idx,
        pos: { row: r2, col: c2 },
        enc: encB,
        rule,
      });
    }

    return {
      grid,
      cleaned,
      pairs,
      cipherPairs,
      final: cipherPairs.join(""),
      perLetter,
    };
  };

  // Build slides that explain every letter (using perLetter array)
  const buildSlides = ({ grid, cleaned, pairs, cipherPairs, final, perLetter }) => {
    const slidesArr = [];

    // Intro slides
    slidesArr.push(
      <div className="slide-card" key="intro-1">
        <h3>Step 1 — Tidy up the message</h3>
        <p>We make the text UPPERCASE, change J → I, and remove spaces/punctuation.</p>
        <p><strong>Cleaned:</strong> <code>{cleaned}</code></p>
      </div>
    );

    slidesArr.push(
      <div className="slide-card" key="intro-2">
        <h3>Step 2 — Make pairs (digraphs)</h3>
        <p>If letters repeat in a pair we insert an <strong>X</strong>; if one letter is left at the end we pad with <strong>X</strong>.</p>
        <p>
          <strong>Pairs:</strong>{" "}
          {pairs.length ? pairs.map((p, i) => <span key={i} style={{marginRight:8}}>{p.a.char}{p.b.char}</span>) : "—"}
        </p>
      </div>
    );

    // Show matrix slide
    slidesArr.push(
      <div className="slide-card" key="matrix">
        <h3>Step 3 — The 5×5 Matrix (from your keyword)</h3>
        <p>Keyword fills first (no repeats), J merged into I, then the rest of the alphabet.</p>
        <div style={{ marginTop: 8 }}>
          <div className="matrix-grid" style={{ display: "inline-block" }}>
            {grid.map((row, r) => (
              <div key={r} className="matrix-row">
                {row.map((cell, c) => (
                  <span key={c} className="matrix-cell">{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // Now a slide per letter (in order of encryption)
    perLetter.forEach((item, idx) => {
      const { original, inserted, pairWith, pairIndex, pos, enc, rule } = item;
      let ruleText = "";
      if (rule === "same-row") {
        ruleText = "They were in the same row — so we move each letter one step to the RIGHT.";
      } else if (rule === "same-col") {
        ruleText = "They were in the same column — so we move each letter one step DOWN.";
      } else {
        ruleText = "They formed a rectangle — each letter takes the column of the other letter.";
      }

      slidesArr.push(
        <div className="slide-card" key={`letter-${idx}`}>
          <h3>Letter {idx + 1}: <code>{original}</code></h3>

          {inserted ? (
            <p><em>Note:</em> This letter is an <strong>inserted X</strong> (used to split doubles or pad the end).</p>
          ) : null}

          <p>
            <strong>Pair:</strong> {original} is paired with <strong>{pairWith}</strong> (pair #{pairIndex + 1}).
          </p>

          <p>
            <strong>Position in matrix:</strong> row {pos.row + 1}, column {pos.col + 1}.
          </p>

          <p>
            <strong>Rule applied:</strong> {ruleText}
          </p>

          <p>
            <strong>Result for this letter:</strong> {original} → <span style={{fontWeight:700}}>{enc}</span>
          </p>
        </div>
      );
    });

    // Final slide
    slidesArr.push(
      <div className="slide-card" key="final">
        <h3>All done — final result</h3>
        <p>We join all encrypted pairs together to make the final secret message.</p>
        <div className="final-encryption-box">{final}</div>
      </div>
    );

    return slidesArr;
  };

  // --- Event handler ---
  const handleEncrypt = (e) => {
    e.preventDefault();
    // if missing input, show warning slide
    if (!message || !key) {
      setOutput("⚠️ Enter both message and key.");
      setMatrix([]);
      setSlides([
        <div className="slide-card" key="err">
          <h3>Missing input</h3>
          <p>Please provide both a message and a keyword to encrypt.</p>
        </div>
      ]);
      setCurrentSlide(0);
      setShowOutput(true);
      return;
    }

    const result = encryptDetailed(message, key);
    setMatrix(result.grid);
    setOutput(result.final);

    const built = buildSlides(result);
    setSlides(built);
    setCurrentSlide(0);
    setShowOutput(true);
  };

  // slider controls
  const prev = () => setCurrentSlide((s) => Math.max(0, s - 1));
  const next = () => setCurrentSlide((s) => Math.min(slides.length - 1, s + 1));
  const goto = (i) => setCurrentSlide(i);

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${playfairBg})` }} />
      <div className="cipher-overlay" />

      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* Left: original content kept intact */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Playfair Cipher Encryption</h1>
            <p>This cipher encrypts letter pairs using a 5x5 matrix of the keyword.</p>

            <form onSubmit={handleEncrypt} className="cipher-form">
              <input type="text" placeholder="Enter Plaintext" value={message} onChange={(e) => setMessage(e.target.value)} required />
              <input type="text" placeholder="Enter Keyword" value={key} onChange={(e) => setKey(e.target.value)} required />
              <button type="submit">Encrypt Message</button>
            </form>

            <div className="output-section">
              <h3>🔏 Encrypted Output</h3>
              <div className="output-box">{output}</div>
            </div>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                The Playfair Cipher encrypts messages by forming digraphs (letter pairs).
                If both letters are in the same row or column, they’re shifted accordingly;
                otherwise, a rectangle rule is applied.
              </p>
              <code>HELLO → HE LX LO → IF MP RV</code>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/hill" className="next-link">Try Hill Cipher →</Link>
            </div>
          </div>
        </div>

        {/* Right: slide viewer (per-letter) */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Step-by-Step (every letter)</h2>

            <div className="white-output-box">
              <p><strong>Original Message:</strong> {message.toUpperCase()}</p>
              <p><strong>Keyword:</strong> {key.toUpperCase().replace(/J/g, "I")}</p>

              {/* Matrix */}
              {matrix.length === 5 && (
                <>
                  <h4>🗂 Generated 5×5 Matrix</h4>
                  <div className="matrix-display">
                    <div className="matrix-grid">
                      {matrix.map((row, i) => (
                        <div className="matrix-row" key={i}>
                          {row.map((cell, j) => (
                            <span className="matrix-cell" key={j}>{cell}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Slide */}
              {slides.length > 0 && (
                <>
                  <div className="step-slider" style={{ marginTop: 12 }}>
                    <div className="slide-card">{slides[currentSlide]}</div>

                    <div className="slider-controls" style={{ marginTop: 10 }}>
                      <button onClick={prev} disabled={currentSlide === 0}>◀ Prev</button>
                      <span> Slide {currentSlide + 1} / {slides.length} </span>
                      <button onClick={next} disabled={currentSlide === slides.length - 1}>Next ▶</button>
                    </div>

                    <div className="slider-dots" style={{ marginTop: 8 }}>
                      {slides.map((_, i) => (
                        <button
                          key={i}
                          className={`dot ${i === currentSlide ? "active" : ""}`}
                          onClick={() => goto(i)}
                          aria-label={`Go to slide ${i + 1}`}
                          style={{
                            width: 8, height: 8, borderRadius: 999, margin: 4,
                            border: "none", background: i === currentSlide ? "#00b894" : "#bbb"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              <h3 style={{ marginTop: 12 }}>✅ Final Encrypted Message</h3>
              <div className="final-encryption-box" style={{ marginTop: 6 }}>{output}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayfairEncrypt;
