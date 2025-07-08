import React from "react";
import Logo from "../assets/Logo.png";

function Navbar() {
  return (
    <div className="main">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top custom-navbar">
        <div className="container-fluid px-4">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={Logo}
              alt="Logo"
              width="50"
              height="50" 
              className="rounded-circle me-2"
            />
            <span className="title">
              <span className="nav-link" href="/">
                रागाCrypt
              </span>
            </span>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/contact">
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/history">
                  History
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">
                  <img
                    src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${Math.floor(
                      Math.random() * 1000
                    )}`}
                    alt="User"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
