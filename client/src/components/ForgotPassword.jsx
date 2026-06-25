import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // await axios.post("http://localhost:5000/api/forgot-password", {
      //   email,
      // });
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("OTP Sent Successfully!");

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Email not registered");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Forgot Password</h2>
        <p className={styles.text}>Enter your registered email</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
