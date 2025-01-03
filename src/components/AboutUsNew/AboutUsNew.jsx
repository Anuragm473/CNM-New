import React from "react";
import styles from "./AboutUsNew.module.css";
import { useNavigate } from "react-router-dom";
import aboutusimg from '../../assets/images/aboutusimg.jpeg'
import testimonialimg from '../../assets/images/testimmonial.png'
import Review from "../Review/Review";

const AboutUsNew = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.mainContainer}>
    <div className={styles.container}>
      <h1>Testimonials</h1>
      <div className={styles.aboutUsSection}>
      <div className={styles.aboutUsLeft}>
        <h1>Once You Try It, You Can't Go Back</h1>
        <p>
        At Caterersnearme, we’re dedicated to making exceptional catering accessible and hassle-free for everyone.
        </p>
        <button
          onClick={() => navigate("/caterer")}
          className={styles.aboutUsBtn}
        >
          Find Caterer
        </button>
      </div>
      <div className={styles.aboutUsRight}>
        <div className={styles.aboutUsImageContainer}>
          <img
            className={styles.aboutUsImage}
            src={testimonialimg}
            alt="caterer serving meal"
          />
        </div>
      </div>
    </div>
    </div>
    <div className={styles.review}>
      <Review/>
      <Review/>
      <Review/>
      <Review/>
      </div>
    </div>
    
  );
};

export default AboutUsNew;
