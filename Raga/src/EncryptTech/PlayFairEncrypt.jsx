import React, { useState } from "react";
import "../EncryptTech/EncryptTech.css";
import playfairBg from "../assets/bg2.jpg";
import { Link } from "react-router-dom";

const PlayfairEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");

  const generateMatrix = (keyword) => {
    keyword = keyword.toUpperCase().replace(/J/g, "I");
    const matrix = [];
    const used = new Set();
    for (const char of keyword + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
      if (!used.has(char)) {
        matrix.push(char);
        used.add(char);
      }
    }
    return Array.from({ length: 5 }, (_, i) => matrix.slice(i * 5, i * 5 + 5));
  };

  const findPos = (matrix, char) => {
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++)
        if (matrix[i][j] === char) return [i, j];
    return [-1, -1];
  };

  const encryptPlayfair = (text, key) => {
    const matrix = generateMatrix(key);
    text = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let result = "";
    for (let i = 0; i < text.length; i += 2) {
      let a = text[i], b = text[i + 1] || "X";
      if (a === b) b = "X";
      const [row1, col1] = findPos(matrix, a);
      const [row2, col2] = findPos(matrix, b);
      if (row1 === row2) {
        result += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
      } else if (col1 === col2) {
        result += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
      } else {
        result += matrix[row1][col2] + matrix[row2][col1];
      }
    }
    return result;
  };

  const handleEncrypt = (e) => {
    e.preventDefault();
    if (key && message) {
      const encrypted = encryptPlayfair(message, key);
      setOutput(encrypted);
    } else {
      setOutput("⚠️ Enter both message and key.");
    }
  };

  return (
    <div className="cipher-page">
      <div className="cipher-bg" style={{ backgroundImage: `url(${playfairBg})` }} />
      <div className="cipher-overlay" />
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
  );
};

export default PlayfairEncrypt;
