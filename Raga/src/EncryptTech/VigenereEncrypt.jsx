import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";

const VigenereEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");

  const handleEncrypt = (e) => {
    e.preventDefault();
    const result = message.split('').reverse().join('') + " (Simulated)";
    setOutput(result);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className="cipher-content">
        <h1>🔐 Vigenère Cipher Encryption</h1>
        <p>Use a repeating keyword to shift letters and encrypt your message with elegance and complexity.</p>

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
            placeholder="Enter Key (e.g. KEY)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <button type="submit">Encrypt Message</button>
        </form>

        <div className="output-section">
          <h3>🔏 Encrypted Output</h3>
          <div className="output-box">{output}</div>
        </div>

        <section className="explanation">
          <h3>📚 How It Works</h3>
          <p>
            Vigenère cipher uses a repeating key to encrypt each letter based on the corresponding letter in the key.
          </p>
          <p>
            For example:
            <br />
            <code>HELLO (key: KEY) → RIJVS</code>
          </p>
        </section>

        <div className="next-technique">
          <p>➡️ Ready for the next cipher?</p>
          <Link to="/encrypt/railfence" className="next-link">Try Rail Fence Cipher →</Link>
        </div>
      </div>
    </div>
  );
};

export default VigenereEncrypt;
