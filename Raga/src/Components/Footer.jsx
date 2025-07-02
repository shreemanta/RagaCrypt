import React from "react";

function Footer() {
  return (
    <div className="main">
      <footer class="bg-dark text-white pt-4 pb-3">
        <div class="container text-center">
          <h5>RagaCrypt</h5>
          <p>
            Exploring the practical world of encryption and decryption for
            secure communication & learning.
          </p>

          <div class="mb-3">
            <a
              href=""
              class="text-white me-3"
              target="_blank"
            >
              <i class="bi bi-github fs-4"></i>
            </a>
            <a
              href="https://linkedin.com/in/shrimanta-chauhan-70a62126a/"
              class="text-white me-3"
              target="_blank"
            >
              <i class="bi bi-linkedin fs-4"></i>
            </a>
            <a href="mailto:mahiacharya04@email.com" class="text-white">
              <i class="bi bi-envelope-fill fs-4"></i>
            </a>
          </div>

          <p class="mb-0">&copy; 2025 RagaCrypt | All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
