import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";

const VigenereEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState([]);
  const [showOutput, setShowOutput] = useState(false);

  const handleEncrypt = (e) => {
    e.preventDefault();

    const text = message.toUpperCase().replace(/[^A-Z]/g, "");
    const keyword = key.toUpperCase().replace(/[^A-Z]/g, "");

    if (!text || !keyword) {
      alert("Please enter valid plaintext and key.");
      return;
    }

    let fullKey = "";
    while (fullKey.length < text.length) {
      fullKey += keyword;
    }
    fullKey = fullKey.slice(0, text.length);

    let result = "";
    const stepByStep = [];

    for (let i = 0; i < text.length; i++) {
      const msgChar = text[i];
      const keyChar = fullKey[i];

      const msgCode = msgChar.charCodeAt(0) - 65;
      const keyCode = keyChar.charCodeAt(0) - 65;
      const encryptedCode = (msgCode + keyCode) % 26;
      const encryptedChar = String.fromCharCode(encryptedCode + 65);

      result += encryptedChar;

      stepByStep.push(
        `Step ${i + 1}: '${msgChar}' (index ${msgCode}) + '${keyChar}' (index ${keyCode}) = ${encryptedCode} → '${encryptedChar}'`
      );
    }

    setOutput(result);
    setSteps(stepByStep);
    setShowOutput(true);
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${bgImg})` }}></div>
      <div className="cipher-overlay"></div>

      <div className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}>
        {/* Left Side (Form + Explanation) */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Vigenère Cipher Encryption</h1>
            <p>
              Use a repeating keyword to shift letters and encrypt your message with elegance and complexity.
            </p>

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

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                The Vigenère Cipher uses a keyword to encrypt each letter of the message. The keyword repeats to match the message length.
              </p>
              <p>
                Each letter is shifted using the corresponding letter in the key. For example:
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

        {/* Right Side (Output) */}
        {showOutput && (
          <div className="right-section">
            <h2>🧠 Step-by-Step Explanation</h2>
            <div className="white-output-box">
              <p>
                Let's go through the encryption step by step. We clean your input and repeat the key to match the message length.
              </p>
              <ul className="step-list">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
              <div className="final-encryption-box">
                Final Encrypted Message: {output}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VigenereEncrypt;
