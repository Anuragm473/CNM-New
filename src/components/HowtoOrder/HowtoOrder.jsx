import React from "react";
import styles from "./HowtoOrder.module.css";
import SangeetDish from "../../assets/images/SangeetDish.jpeg";
import { useNavigate } from "react-router-dom";
import stepOrder from '../../assets/images/stepOrder.jpg'
import aboutusimg from '../../assets/images/aboutusimg.jpeg'

const HowtoOrder = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.aboutUsSection}>
      <div className={styles.aboutUsRight}>
        <h1 style={{textAlign:"center"}}>5-Step ordering process</h1>
        <div className={styles.aboutUsImageContainer}>
          <img
            className={styles.aboutUsImage}
            src={stepOrder}
            alt="How to Order steps"
          />
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default HowtoOrder;
