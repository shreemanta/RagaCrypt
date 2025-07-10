import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DecryptTech.css";
import bgImg from "../assets/bg2.jpg";

const RailFenceDecrypt = () => {
  const [ct, setCt] = useState("");
  const [rails, setRails] = useState(2);
  const [pt, setPt] = useState("");

  const decrypt = (text, key) => {
    if (key < 2) return text;
    const arr = Array.from({ length: key }, () => []);
    let dir = false, r = 0;
    for (let i = 0; i < text.length; i++) {
      arr[r].push(null);
      dir = r === 0 || r === key - 1 ? !dir : dir;
      r += dir ? 1 : -1;
    }
    let idx = 0;
    arr.forEach(row => row.forEach((_, i, a) => a[i] = text[idx++]));
    dir = false; r = 0;
    return Array.from({ length: text.length }, (_, i) => {
      const ch = arr[r].shift();
      dir = r === 0 || r === key - 1 ? !dir : dir;
      r += dir ? 1 : -1;
      return ch;
    }).join("");
  };

  return (
    <div className="cipher-page">
         <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
         <div className="cipher-overlay"></div>
      <div className="cipher-content">
        <h1>🚂 Rail Fence Cipher Decryption</h1>
        <form className="cipher-form" onSubmit={e => { e.preventDefault(); setPt(decrypt(ct, parseInt(rails))); }}>
          <input
            type="text"
            placeholder="Ciphertext"
            value={ct}
            onChange={(e) => setCt(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Number of Rails"
            value={rails}
            onChange={(e) => setRails(e.target.value)}
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
            Rail Fence decryption reconstructs the zigzag pattern and reads it row-by-row to recover the message.
          </p>
        </section>
        <div className="next-technique">
          <Link to="/decrypt/monoalphabetic" className="next-link">
            Next: Monoalphabetic Decryption →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RailFenceDecrypt;
