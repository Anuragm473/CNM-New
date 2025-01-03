import React from "react";
import styles from './WhyCaterernearme.module.css'
import image1 from "../../assets/images/image1.jpeg";
import image2 from "../../assets/images/image2.jpeg";
import image3 from "../../assets/images/image3.jpeg";
import image4 from "../../assets/images/image4.jpeg";
import { useNavigate } from "react-router-dom";

const AboutUsNew = () => {

  const stepsData = [
    {
      number: "01",
      title: "Development Is Faster",
      description: "At Aliquet Viverra Placerat Enim Semper Nulla Ut Am.",
      icon: image1, // Replace with actual image URL
    },
    {
      number: "02",
      title: "Development Is Faster",
      description: "At Aliquet Viverra Placerat Enim Semper Nulla Ut Am.",
      icon: image2, // Replace with actual image URL
    },
    {
      number: "03",
      title: "Development Is Faster",
      description: "At Aliquet Viverra Placerat Enim Semper Nulla Ut Am.",
      icon: image3, // Replace with actual image URL
    },
    {
      number: "04",
      title: "Development Is Faster",
      description: "At Aliquet Viverra Placerat Enim Semper Nulla Ut Am.",
      icon: image4, // Replace with actual image URL
    }
  ];
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>Why Caterersnearme</h1>
      <div className={styles.aboutUsSection}>
      <div className={styles.wave}></div>
      <div className={styles.stepsContainer}>
        <div className={styles.step}>
          <div className={styles.content}>
          <div className={styles.stepNumber} data-number={stepsData[0].number}>
            <span>{stepsData[0].number}</span>
          </div>
          <div className={styles.stepContent}>
            <h3>{stepsData[0].title}</h3>
            <p>{stepsData[0].description}</p>
          </div>
          </div>
          <img src={stepsData[0].icon} alt={`Step ${stepsData[0].number}`} className={styles.icon} />
        </div>
        <div className={styles.step}>
          <img src={stepsData[1].icon} alt={`Step ${stepsData[1].number}`} className={styles.icon} />
          <div className={styles.content}>
          <div className={styles.stepNumber} data-number={stepsData[1].number}>
            <span>{stepsData[1].number}</span>
          </div>
          <div className={styles.stepContent}>
            <h3>{stepsData[1].title}</h3>
            <p>{stepsData[1].description}</p>
          </div>
          </div>
        </div>
        <div className={styles.step}>
        <div className={styles.content}>
          <div className={styles.stepNumber} data-number={stepsData[2].number}>
            <span>{stepsData[2].number}</span>
          </div>
          <div className={styles.stepContent}>
            <h3>{stepsData[2].title}</h3>
            <p>{stepsData[2].description}</p>
          </div>
          </div>
          <img src={stepsData[2].icon} alt={`Step ${stepsData[2].number}`} className={styles.icon} />
        </div>
        <div className={styles.step}>
          <img src={stepsData[3].icon} alt={`Step ${stepsData[3].number}`} className={styles.icon} />
          <div className={styles.content}>
          <div className={styles.stepNumber} data-number={stepsData[3].number}>
            <span>{stepsData[3].number}</span>
          </div>
          <div className={styles.stepContent}>
            <h3>{stepsData[3].title}</h3>
            <p>{stepsData[3].description}</p>
          </div>
          </div>
        </div>
    </div>
      </div>
    </div>
  );
};

export default AboutUsNew;
