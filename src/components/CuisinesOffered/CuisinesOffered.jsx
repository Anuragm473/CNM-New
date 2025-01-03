import React from "react";
import styles from "./CuisinesOffered.module.css";

const CuisinesOffered = ({ cuisines }) => {
  return (
    <div className={styles.cuisinesOffered}>
      <h3>Cuisines Offered</h3>
      <div className={styles.cuisines}>
        {cuisines.map((cuisine, index) => (
          <div className={styles.cuisine} key={index}>
            <div style={{
    width: "10px", // Adjust the size of the dot
    height: "10px",
    backgroundColor: "#020FB7B2", // Dot color
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white", // Icon color
    fontSize: "24px", // Adjust icon size
  }}></div>
            <span>{cuisine}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuisinesOffered;
