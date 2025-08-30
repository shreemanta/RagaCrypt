import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Validate email format
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Validate message length (at least 10 chars)
  const isMessageValid = message.trim().length >= 10;

  // Check if the entire form is valid
  const isFormValid = name.trim() && isEmailValid(email) && isMessageValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Simulate sending message
    console.log("Message Sent:", { name, email, message });
    setSubmitted(true);

    // Reset form after submission
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="main">
      <div className="parent">
        {/* HERO SECTION */}
        <section className="contact-hero">
          <h1 className="typewriter">📬 Contact Us</h1>
          <p>Have a question or feedback? We'd love to hear from you!</p>
          <div className="gif-wrap">
            <img
              src="https://media.giphy.com/media/mGVvZqGoiyegKg5R9t/giphy.gif"
              alt="Encryption animation"
              className="contact-gif"
            />
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="contact-content">
          {/* CONTACT INFO */}
          <div className="contact-info">
            <h2>🤝 Get In Touch</h2>
            <p>
              Our team is here to help you with anything related to
              cryptography, learning, or general inquiries.
            </p>
            <ul>
              <li>📧 Email: mahiacharya04@gmail.com</li>
              <li>📍 Location: Virtual, but everywhere!</li>
              <li>👥 Team: Shrimanta, Mahi & Shital</li>
            </ul>
          </div>

          {/* CONTACT FORM */}
          <div className="contact-form">
            <h2>📝 Send a Message</h2>
            {submitted && (
              <p className="success-message">
                ✅ Your message has been sent successfully!
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {!isEmailValid(email) && email && (
                <p style={{ color: "red", fontSize: "0.8rem" }}>
                  ❌ Invalid email format
                </p>
              )}

              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              {!isMessageValid && message && (
                <p style={{ color: "red", fontSize: "0.8rem" }}>
                  ❌ Message must be at least 10 characters
                </p>
              )}

              <button type="submit" disabled={!isFormValid}>
                Send Message
              </button>
            </form>
            <p className="note">* All fields are required</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
