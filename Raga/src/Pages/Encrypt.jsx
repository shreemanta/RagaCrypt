import React from "react";
import "../Pages/Encrypt.css";
import { Link } from "react-router-dom";
import encryptGif from "../assets/encrypt.gif"; // Replace with your actual gif path

const Encrypt = () => {
  return (
    <div className="encrypt-main">
      <section className="encrypt-hero">
        <h1 className="encrypt-title">🔐 Encryption Zone</h1>
        <p className="encrypt-subtitle">
          Discover how encryption protects our world, from secret messages to
          secure banking.
        </p>
        <img
          src={encryptGif}
          alt="Encryption animation"
          className="encrypt-gif"
        />
      </section>

      <section className="encrypt-info">
        <h2>🧠 What is Encryption?</h2>
        <p>
          Encryption is the process of converting readable data (plaintext) into
          an unreadable format (ciphertext) using a specific algorithm and key.
          Only someone with the right key can decrypt it back.
        </p>

        <h3>🌍 Real-Life Examples:</h3>
        <ul>
          <li>💳 ATM PIN verification</li>
          <li>📱 End-to-end encrypted chats (WhatsApp, Signal)</li>
          <li>🌐 Secure websites (HTTPS)</li>
          <li>🔐 Passwords stored using hashing + encryption</li>
        </ul>
      </section>

      <section className="cipher-table">
        <h2>📜 Classical Ciphers</h2>
        <table>
          <thead>
            <tr>
              <th>Cipher</th>
              <th>Description</th>
              <th>Try It</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Caesar Cipher</td>
              <td>Shifts each letter by a fixed number of places</td>
              <td>
                <Link to="/encrypt/caesar">Use Caesar</Link>
              </td>
            </tr>
            <tr>
              <td>Vigenère Cipher</td>
              <td>Encrypts with a repeating keyword</td>
              <td>
                <Link to="/encrypt/vigenere">Use Vigenère</Link>
              </td>
            </tr>
            <tr>
              <td>Rail Fence Cipher</td>
              <td>Reorders text using zig-zag pattern</td>
              <td>
                <Link to="/encrypt/railfence">Use Rail Fence</Link>
              </td>
            </tr>
            <tr>
              <td>Monoalphabetic</td>
              <td>Each letter replaced by another fixed letter</td>
              <td>
                <Link to="/encrypt/monoalphabetic">Use Monoalphabetic</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="cipher-how">
        <h2>🔍 How Caesar Cipher Works</h2>
        <p>
          The Caesar Cipher shifts each letter in the plaintext by a fixed
          number (key). For example, with a shift of <code>3</code>:
          <br />
          <strong>Plaintext:</strong> <code>HELLO</code> →
          <strong> Ciphertext:</strong> <code>KHOOR</code>
          <br />
          H→K, E→H, L→O, O→R — each letter is moved 3 places forward in the
          alphabet.
        </p>
      </section>
    </div>
  );
};

export default Encrypt;
