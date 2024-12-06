import React from "react";
import styles from "./AboutUsSection.module.css";
import { useNavigate } from "react-router-dom";
import caterer1 from '../../assets/images/caterer1.jpg'
import coverimg from '../../assets/cnm_Images/coverimg.jpg'

const AboutUsSection = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
    <div className={styles.aboutUsSection}>
      <div className={styles.aboutUsLeft}>
        <h2 className={styles.primaryHeader}>Welcome to Caterersnearme! 🍽️</h2>
        <p className={styles.description}>Your trusted destination for finding reliable and exceptional catering services tailored to meet every need and occasion. Whether you’re planning a family gathering, corporate event, or festive celebration, we make it easy to discover, book, and enjoy top-notch catering from curated professionals. Filter by cuisine, budget, and dietary preferences to find exactly what you’re looking for.
        </p>
        <button className={styles.aboutUsBtn} onClick={() => navigate("/caterer")}>Start Now</button>
      </div>
      <div className={styles.aboutUsRight}>
        <div className={styles.aboutUsImageContainer}>
          <img
            className={styles.aboutUsImage1}
            src={coverimg}
            alt="image representing about our busniess"
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutUsSection;
