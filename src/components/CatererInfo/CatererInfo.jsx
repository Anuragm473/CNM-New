import React from "react";
import styles from "./CatererInfo.module.css";

const CatererInfo = ({ info, serviceSpecialist }) => {
  return (
    <div className={styles.caterInfo}>
      <h3 className={styles.catererInfo}>Caterer Information.</h3>
      <p className={styles.info}>{info}</p>
      <h3 className={styles.catererInfo}>Service Specialist</h3>
      <p className={styles.info}>{serviceSpecialist}</p>
    </div>
  );
};

export default CatererInfo;
