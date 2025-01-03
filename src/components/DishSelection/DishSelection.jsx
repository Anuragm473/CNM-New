import React from "react";
import styles from "./DishSelection.module.css";

const DishSelection = ({
  dishes,
  selectedItems,
  onDishSelect,
  storageObject,
  selectedCategory,
}) => {
  const categoryData = storageObject.find(
    (item) => item.name === selectedCategory
  );

  return (
    <div className={styles.dishSelection}>
      <div className={styles.steps}><h3 className={styles.heading}>Choose your dish</h3></div>
      <div className={styles.container}>
      <div className={styles.section}>
      {dishes.map((dish, index) => (
        <div key={index} className={styles.dishItem}>
          <input
            type="checkbox"
            id={`dish-${index}`}
            name={dish}
            checked={selectedItems ? selectedItems.includes(dish) : false}
            onChange={(e) => onDishSelect(dish, e.target.checked)}
            disabled={
              categoryData &&
              categoryData.dishes.length >= categoryData.quantity &&
              !selectedItems.includes(dish)
            }
          />
          <label htmlFor={`dish-${index}`}>{dish}</label>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};

export default DishSelection;
