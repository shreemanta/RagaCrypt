import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const VigenereDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");
  const [steps, setSteps] = useState([]);

  const handleDecrypt = (e) => {
    e.preventDefault();

    const text = ct.toUpperCase();
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (!cleanKey) {
      setPt("⚠️ Invalid key.");
      setSteps([]);
      return;
    }

    let result = "";
    let explanationSteps = [];
    let j = 0; // index for key letters (only moves when we consume a letter)

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch >= "A" && ch <= "Z") {
        const kLetter = cleanKey[j % cleanKey.length];
        const cPos = ch.charCodeAt(0) - 65;           // 0..25
        const kShift = kLetter.charCodeAt(0) - 65;    // 0..25
        const pPos = (cPos - kShift + 26) % 26;
        const pChar = String.fromCharCode(pPos + 65);

        result += pChar;
        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: Take ciphertext letter "${ch}" (${cPos}).
Use key letter "${kLetter}" (${kShift}) → subtract: ${cPos} - ${kShift} = ${cPos - kShift}.
Wrap with mod 26 → ${pPos}. Convert to letter → "${pChar}".`
        });

        j++; // only advance key on letters
      } else {
        result += ch;
        explanationSteps.push({
          id: i + 1,
          content: `Step ${i + 1}: "${ch}" is not a letter → keep it as it is.`
        });
      }
    }

    setPt(result);
    setSteps(explanationSteps);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      {/* Wrapper switches to two-column when pt exists (same as your CaesarEncrypt) */}
      <div className={`cipher-content-wrapper ${pt ? "show-output" : ""}`}>
        {/* LEFT – keep your existing content */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Vigenère Cipher Decryption</h1>
            <form className="cipher-form" onSubmit={handleDecrypt}>
              <input
                type="text"
                placeholder="Ciphertext"
                value={ct}
                onChange={(e) => setCt(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Keyword"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Decrypt</button>
            </form>

            <div className="output-section">
              <h3>🔓 Plaintext</h3>
              <div className="output-box">{pt}</div>
            </div>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                Vigenère decryption shifts each letter <b>backward</b> using the repeating key.
                Non-letters (spaces, punctuation) are kept as they are.
              </p>
              <p>
                Example: keyword = <code>KEY</code>, ciphertext = <code>RIJVS → HELLO</code>.
              </p>
            </section>

            <div className="next-technique">
              <Link to="/decrypt/railfence" className="next-link">
                Next: Rail Fence Decryption →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT – white themed step-by-step panel */}
        {pt && (
          <div className="right-section white-output-box">
            <h2>🧠 Step-by-Step Decryption</h2>
            <p><strong>Ciphertext:</strong> {ct.toUpperCase()}</p>
            <p><strong>Keyword (cleaned):</strong> {key.toUpperCase().replace(/[^A-Z]/g, "")}</p>

            <ul className="step-list">
              {steps.map((s) => (
                <li key={s.id}>{s.content}</li>
              ))}
            </ul>

            <h3>✅ Final Decrypted Message:</h3>
            <div className="final-encryption-box">{pt}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VigenereDecrypt;
