import React from "react";
import styles from "./AboutUsNew.module.css";
import SangeetDish from "../../assets/images/SangeetDish.jpeg";
import { useNavigate } from "react-router-dom";
import caterer2 from '../../assets/images/caterer2.jpg'
import aboutusimg from '../../assets/images/aboutusimg.jpeg'

const AboutUsNew = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>About Caterersnearme</h1>
      <div className={styles.aboutUsSection}>
      <div className={styles.aboutUsLeft}>
        <h1>About Us</h1>
        <p>
        At Caterersnearme, we’re dedicated to making exceptional catering accessible and hassle-free for everyone. Founded with a passion for culinary excellence and a commitment to quality service, we provide a seamless platform that connects you with trusted caterers who suit your event’s specific needs. Our network of professionals includes a diverse range of options—from traditional, pure vegetarian cuisine to modern and eclectic menus—ensuring there’s something for every taste.
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
            src={aboutusimg}
            alt="Catering"
          />
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default AboutUsNew;
