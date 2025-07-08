import React from "react";

function Footer() {
  return (
    <div className="main">
      <footer className="bg-dark text-white pt-4 pb-3">
        <footer className="bg-dark text-white pt-4 pb-3 ">
          <div className="container text-center">
            <h5>RagaCrypt</h5>
            <p>
              Exploring the practical world of encryption and decryption for
              secure communication & learning.
            </p>

            <div className="mb-3">
              <a href="" className="text-white me-3" target="_blank">
                <i className="bi bi-github fs-4"></i>
              </a>
              <a
                href="https://linkedin.com/in/shrimanta-chauhan-70a62126a/"
                className="text-white me-3"
                target="_blank"
              >
                <i className="bi bi-linkedin fs-4"></i>
              </a>
              <a href="mailto:mahiacharya04@email.com" className="text-white">
                <i className="bi bi-envelope-fill fs-4"></i>
              </a>
            </div>

            <p className="mb-0">&copy; 2025 RagaCrypt | All rights reserved.</p>
          </div>
        </footer>
      </footer>
    </div>
  );
}

export default Footer;
