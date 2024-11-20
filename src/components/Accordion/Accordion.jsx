import React, { useState, useRef } from "react";
import styles from "./Accordion.module.css";

const Accordion = (props) => {
  const [selected, setSelected] = useState(null);
  const accordionContentRefs = useRef([]);


  const toggle = (index) => {
    if (selected === index) {
      setSelected(null);
    } else {
      setSelected(index);
    }
  };

  return (
    <div className={styles.accordionContainer}>
      {props.data.map((item, index) => {
        const isSelected = selected === index;
        const contentRef = accordionContentRefs.current[index];
        const contentHeight =
          isSelected && contentRef ? contentRef.scrollHeight : 0;

        return (
          <div
            className={styles.detailAccordion}
            onClick={() => toggle(index)}
            key={index}
            style={{
              height: isSelected ? `${contentHeight + 90}px` : "42px",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <div className={styles.accordionHeading}>
              <b>{item.name}</b>
              <i
                className={`fa-solid fa-caret-up ${
                  isSelected ? "" : styles.flip
                }`}
              ></i>
            </div>
            <div
              className={styles.accordionContent}
              ref={(el) => (accordionContentRefs.current[index] = el)}
            >
              {item.dishes.map((dish, dishIndex) => (
                <p key={dishIndex}>{`${dishIndex + 1}. ${dish}`}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
