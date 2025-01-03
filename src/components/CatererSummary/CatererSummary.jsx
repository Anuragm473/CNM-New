import React from "react";
import caterersummary from "../../assets/images/caterersummary.png";
import styles from "./CatererSummary.module.css";

const CatererSummary = ({
  serviceStartDate,
  capacity,
  cateringType,
  serviceLocation,
}) => {
  return (
    <div className={styles.catererSummary}>
      <div className={styles.leftCont}>
        <img src={caterersummary} className={styles.image} />
      </div>
      <div className={styles.rightCont}>
        <h3 className={styles.heading}>Caterer Summary</h3>
        <ul className={styles.list}>
          <li>
            <span className={styles.arrow}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </span>
            <span>In Service Since: {serviceStartDate}</span>
          </li>
          <li>
            <span className={styles.arrow}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </span>
            <span>Capacity: {capacity}</span>
          </li>
          <li>
            <span className={styles.arrow}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </span>
            <span>Catering Type: {cateringType}</span>
          </li>
          <li>
            <span className={styles.arrow}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </span>
            <span>
              Experience: At least {new Date().getFullYear() - serviceStartDate}{" "}
              Year(s)
            </span>
          </li>
          <li>
            <span className={styles.arrow}>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </span>
            <span>Service Location: {serviceLocation}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CatererSummary;
