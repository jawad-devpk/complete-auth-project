import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./VerifyOTP.module.css";
import { FaKey } from "react-icons/fa";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (seconds === 0) {
      toast.error("OTP Expired");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        otp,
      });

      toast.success("OTP Verified");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/api/forgot-password", {
        email,
      });

      toast.success("OTP Resent");
      setSeconds(60);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Verify OTP</h2>
        <p>{email}</p>

        <div className={styles.timer}>
          {seconds > 0 ? `00:${seconds}` : "OTP Expired"}
        </div>

        <form onSubmit={handleVerify}>
          <div className={styles.inputBox}>
            <FaKey className={styles.icon} />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button className={styles.btn} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {seconds === 0 && (
          <button className={styles.resend} onClick={resendOTP}>
            Resend OTP
          </button>
        )}

        <button className={styles.backBtn} onClick={() => navigate("/login")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
