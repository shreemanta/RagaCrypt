import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/loginbg.jpg";
import "./RegistrationForm.css";
import registerGif from "../assets/registerGif.gif";

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "User",
    captcha: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [serverError, setServerError] = useState("");

  // ------------------ VALIDATION ------------------
  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.fullname)) {
      newErrors.fullname = "Name must contain only letters and spaces.";
    }

    if (!/^[a-zA-Z0-9]{3,15}$/.test(formData.username)) {
      newErrors.username = "Username must be 3–15 alphanumeric characters.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Phone validation (India standard: 6–9 followed by 9 digits)
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone must start with 6-9 and be 10 digits.";
    }

    const password = formData.password;
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, number, and special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.captcha) {
      newErrors.captcha = "Please confirm you're not a robot.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ PASSWORD STRENGTH ------------------
  const checkPasswordStrength = (password) => {
    let strength = "Weak";
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      strength = "Strong";
    } else if (password.length >= 6) {
      strength = "Moderate";
    }
    setPasswordStrength(strength);
  };

  // ------------------ FORM HANDLERS ------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") checkPasswordStrength(value);
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (validate()) {
      try {
        const res = await fetch("http://localhost:3001/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: formData.fullname,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
          }),
        });

        const data = await res.json(); // ✅ only once
        console.log("Server response:", data);

        if (res.ok) {
          alert("✅ Registration successful!");
          navigate("/login");
        } else {
          setServerError(data.error || "Registration failed");
        }
      } catch (err) {
        console.error("Register error:", err);
        setServerError("❌ Server error, try again later.");
      }
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="registration-container">
      <div
        className="cipher-bg"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div className="cipher-overlay"></div>

      <div className="registration-parent">
        <div className="gif-box">
          <img src={registerGif} alt="Register GIF" className="gif-image" />
        </div>
        <form onSubmit={handleSubmit} className="registration-box">
          <h2>Create Account</h2>

          {serverError && <p className="error-message">{serverError}</p>}

          <label>Full Name</label>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            value={formData.fullname}
            onChange={handleChange}
          />
          {errors.fullname && <p className="error-message">{errors.fullname}</p>}

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter 10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter a strong password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="password-strength">
            Password strength: {passwordStrength}
          </div>
          {errors.password && <p className="error-message">{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}

          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <div className="captcha-box">
            <input
              type="checkbox"
              id="captcha"
              name="captcha"
              checked={formData.captcha}
              onChange={handleChange}
            />
            <label htmlFor="captcha">I'm not a robot</label>
          </div>
          {errors.captcha && <p className="error-message">{errors.captcha}</p>}

          <button type="submit">Register</button> 
          <div className="link-login">
            <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p></div> 
        </form>
        
      </div>
    </div>
  );
}

export default RegistrationForm;
