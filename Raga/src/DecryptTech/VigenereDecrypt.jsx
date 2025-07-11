import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const VigenereDecrypt = () => {
  const [ct, setCt] = useState("");
  const [key, setKey] = useState("");
  const [pt, setPt] = useState("");

  const decrypt = (text, k) => {
    const cleanC = text.toUpperCase().replace(/[^A-Z]/g, "");
    const cleanK = k.toUpperCase().replace(/[^A-Z]/g, "");
    if (!cleanK) return "Invalid key.";

    return cleanC.replace(/./g, (c, i) => {
      const shift = cleanK.charCodeAt(i % cleanK.length) - 65;
      return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
    });
  };

  return (
    <div className="cipher-page">
         <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
         <div className="cipher-overlay"></div>
      <div className="cipher-content">
        <h1>🔐 Vigenère Cipher Decryption</h1>
        <form className="cipher-form" onSubmit={e => { e.preventDefault(); setPt(decrypt(ct, key)); }}>
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
            Vigenère decryption shifts each letter backward using the repeating key.
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
  );
};

export default VigenereDecrypt;
