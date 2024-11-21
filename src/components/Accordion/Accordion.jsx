import React from "react";
import styles from "./Accordion.module.css";

const Accordion = (props) => {
  return (
    <div className={styles.accordionContainer}>
      {props.data.map((item, index) => (
        <div
          className={styles.detailAccordion}
          key={index}
          style={{
            height: "auto", // Always allow full height
            overflow: "visible", // Ensure all content is visible
          }}
        >
          <div className={styles.accordionHeading}>
            <b>{item.name}</b>
          </div>
          <div className={styles.accordionContent}>
            {item.dishes.map((dish, dishIndex) => (
              <p key={dishIndex}>{`${dishIndex + 1}. ${dish}`}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
