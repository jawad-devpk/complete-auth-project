import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Dashboard.module.css";

import { FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      // await axios.post(
      //   "http://localhost:5000/api/logout",
      //   {},
      //   { withCredentials: true },
      // );
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logout`,
        {},
        { withCredentials: true },
      );

      toast.success("Logout Successful");
      navigate("/login");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  return (
    <div
      className={
        darkMode ? `${styles.container} ${styles.dark}` : styles.container
      }
    >
      <div className={styles.navbar}>
        <h2>Welcome To Dashboard</h2>

        <div className={styles.rightSide}>
          <button
            className={styles.themeBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h1>Dashboard Home</h1>
        <p>You are successfully logged in.</p>
      </div>
    </div>
  );
};

export default Dashboard;
