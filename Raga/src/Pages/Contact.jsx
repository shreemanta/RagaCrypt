import React from "react";
import "./Contact.css";
function Contact() {
  return (
    <div className="main">
      <div className="parent">
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

        <section className="contact-content">
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

          <div className="contact-form">
            <h2>📝 Send a Message</h2>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" disabled>
                Coming Soon
              </button>
            </form>
            <p className="note">* Messaging feature coming soon!</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;
