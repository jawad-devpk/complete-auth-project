import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ResetPassword.module.css";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/reset-password", {
        email,
        newPassword: data.password,
      });

      toast.success("Password Reset Success");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Reset Password</h2>

        <form onSubmit={handleReset}>
          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              required
            />
            <span onClick={() => setShow(!show)}>
              {show ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className={styles.inputBox}>
            <FaLock className={styles.icon} />
            <input
              type={show ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
          </div>

          <button className={styles.btn} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
