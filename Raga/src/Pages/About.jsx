import React from "react";
import "./About.css";
import Img1 from "../assets/img1.jpg";
function About() {
  return (
    <div className="main">
      <section className="About">
        <div className="about-container">
          <div className="img">
            <img src={Img1} alt="About" className="about-image" />
          </div>
          <div className="content">
            <h1>Decrypting RagaCrypt</h1>
            <p>
              RagaCrypt is an educational and practical tool built to explore
              the art and science of encryption and decryption. Designed for
              students, developers, and cybersecurity enthusiasts, it showcases
              how both classical and modern cryptographic algorithms protect
              data in the digital world.
            </p>
            <p>
              From simple Caesar and Vigenère ciphers to robust AES and RSA
              encryption, users can encode and decode messages using
              customizable key-based techniques. Whether you're learning about
              secure communication or experimenting with cipher logic, RagaCrypt
              provides a hands-on, intuitive interface for deeper understanding.
            </p>
            <p>
              This project highlights the critical role of cryptography in
              privacy, secure messaging, and modern information security. We
              believe knowledge of cryptography is essential in today’s digital
              age — and RagaCrypt is your gateway to it.
            </p>
            <h2 style={{ color: "#00ffc6", marginTop: "2rem" }}>
              🚀 Why RagaCrypt?
            </h2>
            <ul style={{ paddingLeft: "1.5rem" }}>
              <li>✨ Visualize classic & modern encryption techniques</li>
              <li>🔐 Interactive learning for students and curious minds</li>
              <li>⚙️ Real-time encoding/decoding for practical demos</li>
              <li>📚 Built for education, privacy, and digital awareness</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
