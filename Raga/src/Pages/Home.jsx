// import React from "react";
// import "./Home.css";
// import { Link } from "react-router-dom";

// function Home() {
//   console.log("✅ Home component loaded");
//   return (
//     <div className="main">
//       <div className="parent">
//         <div className="HeadMaster">
//           <h1 className="wel">Welcome to रागाCrypt</h1>
//           <span className="slogan">Explore Cipher , Experience Security</span>
//           <div className="content">
//             <p>
//               Step into the world of cryptic codes and powerful algorithms. From
//               classic ciphers to modern encryption, experience how secrets are
//               forged and unlocked. Built for minds that question and explore.
//             </p>
//           </div>
//         </div>
//         <div className="card-container">
//           <Link to="/encrypt" className="cipher-card encrypt">
//             <h2>Encrypt</h2>
//             <p>
//               Transform clear thoughts into coded whispers. Step into the realm
//               of secrets and scramble the visible.
//             </p>
//           </Link>

//           <Link to="/decrypt" className="cipher-card decrypt">
//             <h2>Decrypt</h2>
//             <p>
//               Peel back the veil of mystery. Reveal hidden truths by decoding
//               what was once concealed.
//             </p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;
import React, { useRef, useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const cardsRef = useRef([]);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => {
      cardsRef.current.forEach((el) => el && observer.unobserve(el));
    };
  }, []);

  return (
    <div className="main">
      <div className="parent">
        <div className="HeadMaster">
          <h1 className="wel">Welcome to रागाCrypt</h1>
          <span className="slogan">Explore Cipher , Experience Security</span>
          <div className="content">
            <p>
              Step into the world of cryptic codes and powerful algorithms. From
              classic ciphers to modern encryption, experience how secrets are
              forged and unlocked. Built for minds that question and explore.
            </p>
          </div>
        </div>
        <div className="info-section">
          <h2>🔐 What is Encoding and Decoding?</h2>
          <p>
            Encoding is the process of converting data into a different format
            so it can be efficiently stored, transmitted, or processed. Decoding
            is the process of converting that data back to its original form.
          </p>
          <p>
            In the context of cryptography, encoding and decoding help in
            transforming readable data into secure formats and then retrieving
            the original data when needed.
          </p>

          <h3>🎯 Why is it Important?</h3>
          <ul>
            <li>
              <strong>Data Protection:</strong> Helps in hiding or securing the
              original data, especially during transfer.
            </li>
            <li>
              <strong>Communication Efficiency:</strong> Ensures that data can
              be safely and correctly transmitted over networks.
            </li>
            <li>
              <strong>Learning the Basics of Cryptography:</strong>{" "}
              Encoding/decoding lays the foundation for understanding more
              complex encryption methods.
            </li>
            <li>
              <strong>Platform Compatibility:</strong> Allows data to be used
              across different devices, systems, or apps.
            </li>
          </ul>

          <h4>📦 Practical Use in Real-World Scenarios:</h4>
          <ul>
            <li>Encoding in QR codes</li>
            <li>URL encoding in browsers</li>
            <li>File encoding in uploads</li>
            <li>Secure messaging in apps</li>
          </ul>
        </div>

        <div className="card-container">
          {["encrypt", "decrypt"].map((type, idx) => (
            <Link
              key={idx}
              to={`/${type}`}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`cipher-card ${type} ${
                visibleCards.includes(idx) ? "show" : "hidden"
              }`}
            >
              <h2>{type === "encrypt" ? "Encrypt" : "Decrypt"}</h2>
              <p>
                {type === "encrypt"
                  ? "Transform clear thoughts into coded whispers. Step into the realm of secrets and scramble the visible."
                  : "Peel back the veil of mystery. Reveal hidden truths by decoding what was once concealed."}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
