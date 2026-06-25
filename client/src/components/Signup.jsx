
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Signup.module.css";

import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    if (!password) return "";
    return strongRegex.test(password) ? "strong" : "weak";
  };

  const strength = checkPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill all fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (strength !== "strong") {
      toast.error("Password must be strong!");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post(
        "http://127.0.0.1:5000/api/signup",
        userData,
      );

      toast.success(res.data.message || "Signup Successfully!");

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const message = error.response?.data?.message;

      if (message === "email already exists") {
        toast.error("Email is already exist!");
      } else {
        toast.error(message || "Signup failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className={styles.inputBox}>
            <FaUser />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBox}>
            <FaEnvelope />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputBox}>
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {formData.password && (
            <div
              className={
                strength === "strong"
                  ? styles.messageStrong
                  : styles.messageWeak
              }
            >
              {strength === "strong"
                ? "Strong Password 💪"
                : "Weak Password ⚠ (6+ chars, number & special char required)"}
            </div>
          )}

          <div className={styles.inputBox}>
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "Create Account"}
          </button>

          <button
            type="button"
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
