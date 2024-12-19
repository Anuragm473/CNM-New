import React, { useState } from "react";
import styles from "./ForgotPass.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { toastMessage } from "../../../utility";
import { ToastContainer } from "react-toastify";

export default function ForgotPass() {
  const { hash } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setIsPending] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!validatePassword(password)) {
      toastMessage(
        "Password must be at least 8 characters long with one alphabet and one number"
      );
      return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      toastMessage("Password and confirm password don't match");
      return;
    }

    // Proceed with API call if validations pass
    try {
      setIsPending(true);
      await axios.post("https://www.caterersnearme.in/api/auth/reset/password", {
        password,
        hash,
      });
      toastMessage("Password reset successfully!");
      navigate("/");
    } catch (err) {
      toastMessage("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Reset Password</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button disabled={pending} type="submit" className={styles.button}>
          {pending ? <div className={styles.spinner}></div> : "Submit"}
        </button>
      </form>
    </div>
    </>
  );
}
