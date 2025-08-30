import React from "react";
import "../Pages/Encrypt.css";
import { Link } from "react-router-dom";
import decryptGif from "../assets/Encrypt.gif"; // Replace with your actual gif path

const Decrypt = () => {
  return (
    <div className="encrypt-main">
      <section className="encrypt-hero">
        <h1 className="encrypt-title">🔓 Decryption Zone</h1>
        <p className="encrypt-subtitle">
          Explore how encrypted messages are unlocked and made readable again.
        </p>
        <img
          src={decryptGif}
          alt="Decryption animation"
          className="encrypt-gif"
        />
      </section>

      <section className="encrypt-info">
        <h2>🧠 What is Decryption?</h2>
        <p>
          Decryption is the process of converting encrypted data (ciphertext) back into its original form (plaintext) using a specific algorithm and key. It ensures that only authorized parties can access the information.
        </p>

        <h3>🌍 Real-Life Examples:</h3>
        <ul>
          <li>🔓 Unlocking secure email messages</li>
          <li>📱 Reading end-to-end encrypted chats</li>
          <li>🖥️ Accessing secure files with passwords</li>
          <li>🔑 Verifying digital signatures</li>
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
              <td>Shifts each letter back by a fixed number of places</td>
              <td><Link to="/decrypt/caesar">Decrypt Caesar</Link></td>
            </tr>
            <tr>
              <td>Vigenère Cipher</td>
              <td>Decrypts with a repeating keyword</td>
              <td><Link to="/decrypt/vigenere">Decrypt Vigenère</Link></td>
            </tr>
            <tr>
              <td>Rail Fence Cipher</td>
              <td>Reorders zig-zagged text into original</td>
              <td><Link to="/decrypt/railfence">Decrypt Rail Fence</Link></td>
            </tr>
            <tr>
              <td>Monoalphabetic</td>
              <td>Reverses letter-pair rules using the same grid to get back the original message.</td>
              <td><Link to="/decrypt/monoalphabetic">Decrypt Monoalphabetic</Link></td>
            </tr>
            <tr>
              <td>Playfair</td>
              <td>Each letter replaced by a known mapping</td>
              <td><Link to="/decrypt/playfair">Decrypt Playfair</Link></td>
            </tr>
            <tr>
              <td>Hill</td>
              <td>Uses the inverse of the key matrix to recover the plaintext from ciphertext.</td>
              <td><Link to="/decrypt/hill">Decrypt Hill</Link></td>
            </tr>
            <tr>
              <td>AES</td>
              <td>AES decryption is the process of converting ciphertext back into readable plaintext using the same symmetric key by reversing AES encryption operations.</td>
              <td><Link to="/decrypt/aes">Decrypt AES</Link></td>
            </tr>
            <tr>
              <td>RSA</td>
              <td>RSA decryption is the process of converting ciphertext back to plaintext using the private key corresponding to the public key that was used for encryption.</td>
              <td><Link to="/decrypt/rsa">Decrypt RSA</Link></td>
            </tr>
             <tr>
              <td>Column Transposition cipher</td>
              <td>Reconstructs the column order using the same keyword and reads row-wise to retrieve the original plaintext.</td>
              <td><Link to="/decrypt/columnar">Decrypt Column Transposition</Link></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="encrypt-working">
        <h2>🔍 How Decryption Works</h2>
        <p>
          Using Caesar Cipher with shift 3 as example:
          <br />
          Ciphertext: <code>KHOOR</code> → Plaintext: <code>HELLO</code>
          <br />
          The algorithm shifts each letter in your message 3 positions back in the alphabet.
        </p>
      </section>
    </div>
  );
};

export default Decrypt;
