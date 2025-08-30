import React, { useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "../EncryptTech/EncryptTech.css";
import bgImg from "../assets/bg2.jpg";
import { saveHistory } from "../utils/saveHistory";

const RailFenceEncrypt = () => {
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [steps, setSteps] = useState([]); // ✅ FIXED (no <string[]>)
  const [showOutput, setShowOutput] = useState(false);

  const handleEncrypt = (e) => {
    e.preventDefault();

    const railsCount = parseInt(key, 10);
    if (isNaN(railsCount) || railsCount < 2) {
      setSteps([
        "We need at least 2 rails (zig-zag lines) to do the Rail Fence Cipher. Please enter a number like 2, 3, or 4.",
      ]);
      setEncrypted("");
      setShowOutput(true);
      
      return;
    }

    // Build rails and record placements
    const rails = Array.from({ length: railsCount }, () => []);
    const placements = [];

    let row = 0;
    let goingDown = true;

    for (let i = 0; i < message.length; i++) {
      const ch = message[i];
      rails[row].push(ch);
      placements.push({ char: ch, rail: row, index: i });

      if (row === 0) goingDown = true;
      else if (row === railsCount - 1) goingDown = false;

      row += goingDown ? 1 : -1;
    }

    const cipher = rails.map((r) => r.join("")).join("");

    // Child-friendly explanation
    const stepList = [];
    stepList.push(
      `We will write your message in a zig-zag across ${railsCount} rails (rows). Think of it like stairs: we go down one step at a time, and when we reach the bottom, we go back up.`
    );
    stepList.push(
      `Message: "${message}" — we place each character on a rail as we move down and up.`
    );

    placements.forEach((p, idx) => {
      stepList.push(`Step ${idx + 1}: Put '${p.char}' on rail ${p.rail + 1}.`);
    });

    rails.forEach((r, idx) => {
      stepList.push(`Rail ${idx + 1} reads: "${r.join("")}"`);
    });

    stepList.push(
      "Finally, we read the rails from top to bottom and glue them together."
    );
    saveHistory({
        type: "RailFence Cipher",
        action: "Encryption",
        input: message,
        key: key,
        output: cipher,
      });
    setEncrypted(cipher);
    setSteps(stepList);
    setShowOutput(true);
  };
  // ✅ Generate PDF function
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const pad = 12; // same as Hill Cipher
      let y = 16;
      const lineGap = 8;
      const sectionGap = 12;

      // --------- helper functions ----------
      const write = (txt, size = 11, color = [0, 0, 0]) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(txt, pageWidth - pad * 2);
        lines.forEach((line) => {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 16;
          }
          doc.text(line, pad, y);
          y += lineGap;
        });
      };

      const writeSectionTitle = (txt) => {
        if (y + 10 > pageHeight - 15) {
          doc.addPage();
          y = 16;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(17, 122, 101); // teal like Hill Cipher
        doc.text(txt, pad, y);
        y += sectionGap;
        doc.setDrawColor(17, 122, 101);
        doc.setLineWidth(0.5);
        doc.line(pad, y - 7, pageWidth - pad, y - 7);
      };

      const writeTag = (label, value) => {
        if (y + 8 > pageHeight - 15) {
          doc.addPage();
          y = 16;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(90, 90, 90);
        doc.text(`${label}:`, pad, y);
        doc.setTextColor(0, 0, 0);
        doc.text(value, pad + 28, y);
        y += lineGap;
      };

      // --------- HEADER ----------
      doc.setDrawColor(46, 134, 193);
      doc.setFillColor(240, 248, 255);
      doc.roundedRect(pad - 4, y - 8, pageWidth - 2 * pad + 8, 18, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(46, 134, 193);
      doc.text("Rail Fence Cipher — Trendy Walkthrough", pad, y + 4);
      y += 24;

      // --------- INPUT DETAILS ----------
      writeTag("Original Message", message || "(empty)");
      writeTag("Number of Rails", key || "(empty)");

      // --------- STEP-BY-STEP ----------
      writeSectionTitle("Step-by-Step Explanation");
      steps.forEach((step, idx) => {
        write(`• ${step}`);
      });

      // --------- FINAL RESULT ----------
      writeSectionTitle("Final Encrypted Message");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0); // green like Hill Cipher encrypted blocks
      write(encrypted || "—");

      // --------- FOOTER ----------
      if (y + 16 > pageHeight - 15) {
        doc.addPage();
        y = 16;
      }
      y = pageHeight - 10;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("Generated by RagaCrypt • Rail Fence Cipher", pad, y);

      // save
      doc.save("RailFenceCipher.pdf");
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. Check console for details.");
    }
  };

  return (
    <div className="cipher-page">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div className="cipher-overlay"></div>

      <div
        className={`cipher-content-wrapper ${showOutput ? "show-output" : ""}`}
      >
        {/* Left: Input Form */}
        <div className="left-section">
          <div className="cipher-content">
            <h1>🔐 Rail Fence Cipher Encryption</h1>
            <p>
              Arrange the letters in a zig-zag pattern to hide the original
              message.
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
                type="number"
                placeholder="Enter Number of Rails (e.g. 2)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                required
              />
              <button type="submit">Encrypt Message</button>
            </form>

            <section className="explanation">
              <h3>📚 How It Works</h3>
              <p>
                We write your message in a zig-zag across the rails (rows). When
                we reach the bottom rail, we “bounce” and go back up. After
                writing the whole message in this pattern, we read each rail
                from top to bottom and join them to get the secret message.
              </p>
              <p>
                Example (2 rails):
                <br />
                <code>WE ARE DISCOVERED → WERDSOEAE DICVRD</code>
              </p>
            </section>

            <div className="next-technique">
              <p>➡️ Ready for the next cipher?</p>
              <Link to="/encrypt/monoalphabetic" className="next-link">
                Try Monoalphabetic Cipher →
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        {showOutput && (
          <div className="right-section">
            <h2>🔏 Encrypted Output</h2>
            <div className="white-output-box">
              <p>
                <strong>Original Message:</strong> {message}
              </p>
              <p>
                <strong>Rails:</strong> {key}
              </p>

              <h3>🧠 Step-by-Step</h3>
              <ul className="step-list">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3>✅ Final Encrypted Message</h3>
              <div className="final-encryption-box">{encrypted}</div>
              <button onClick={handleDownloadPDF} className="pdf-btn">
                📄 Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RailFenceEncrypt;
