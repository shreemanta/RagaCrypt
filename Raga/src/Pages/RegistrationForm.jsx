import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/loginbg.jpg";
import "./RegistrationForm.css";
import registerGif from "../assets/registerGif.gif";

function RegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Name must contain only letters and spaces.";
    }

    if (!/^[a-zA-Z0-9]{3,15}$/.test(formData.username)) {
      newErrors.username = "Username must be 3–15 alphanumeric characters.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") checkPasswordStrength(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formData);
      alert("Registration successful!");
      navigate("/login");
    }
  };

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

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p>{errors.fullName}</p>}

          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}

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
          {errors.password && <p>{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit">Register</button>
          {/* I'm not a robot */}
          <div className="captcha-box">
            <input
              type="checkbox"
              id="captcha"
              checked={formData.captcha || false}
              onChange={(e) =>
                setFormData({ ...formData, captcha: e.target.checked })
              }
            />
            <label htmlFor="captcha">I'm not a robot</label>
          </div>
          {errors.captcha && <p>{errors.captcha}</p>}

          {/* Already have an account? */}
          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
