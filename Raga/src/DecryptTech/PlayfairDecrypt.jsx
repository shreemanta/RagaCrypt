import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const PlayfairDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");

  const format = (s) => s.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const matrix = (k) => {
    const seq = Array.from(new Set(format(k) + "ABCDEFGHIKLMNOPQRSTUVWXYZ"));
    return Array.from({ length: 5 }, (_, i) => seq.slice(i * 5, i * 5 + 5));
  };

  const decrypt = (text, km) => {
    const seq = [];
    const pos = {};
    km.flat().forEach((c, i) => { seq.push(c); pos[c] = [Math.floor(i / 5), i % 5]; });
    const digraphs = text.match(/.{1,2}/g) || [];
    return digraphs.map(([a, b]) => {
      const [r1, c1] = pos[a], [r2, c2] = pos[b];
      if (r1 === r2) return km[r1][(c1 + 4) % 5] + km[r2][(c2 + 4) % 5];
      if (c1 === c2) return km[(r1 + 4) % 5][c1] + km[(r2 + 4) % 5][c2];
      return km[r1][c2] + km[r2][c1];
    }).join("");
  };

  return (
    <div className="cipher-page">
         <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
         <div className="cipher-overlay"></div>
      <div className="cipher-content">
        <h1>🔐 Playfair Cipher Decryption</h1>
        <form className="cipher-form" onSubmit={e => { e.preventDefault(); setPt(decrypt(format(ct), matrix(key))); }}>
          <input
            type="text"
            placeholder="Ciphertext"
            value={ct}
            onChange={e => setCt(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Keyword"
            value={key}
            onChange={e => setKey(e.target.value)}
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
            Uses a 5×5 keyword matrix to reverse digraph substitution: same row → shift left; same column → shift up; rectangle rule otherwise.
          </p>
        </section>
        <div className="next-technique">
          <Link to="/decrypt/hill" className="next-link">
            Next: Hill Decryption →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlayfairDecrypt;
