import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Login.module.css";

import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // await axios.post("http://localhost:5000/api/login", loginData, {
      //   withCredentials: true,
      // });
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        loginData,
        {
          withCredentials: true,
        },
      );

      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setOtpLoading(true);

  
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        loginData,
        {
          withCredentials: true,
        },
      );

      toast.success("OTP sent to your Email");

      navigate("/verify-otp", {
        state: { email: forgotEmail },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Email not registered");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className={styles.inputBox}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />

            <span
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?
            <span onClick={() => navigate("/signup")}>Register here</span>
          </p>

          <p
            className={styles.forgotLink}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </div>

        {showForgot && (
          <div className={styles.forgotBox}>
            <h3>Reset Password</h3>

            <form onSubmit={handleForgotPassword}>
              <div className={styles.inputBox}>
                <FaKey className={styles.icon} />
                <input
                  type="email"
                  placeholder="Enter Registered Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.btn}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
