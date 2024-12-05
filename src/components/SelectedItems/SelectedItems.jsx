import React from 'react';
import styles from './SelectedItems.module.css';

const SelectedItems = ({ selectedDishes }) => {
  return (
    <div className={styles.selectedItems}>
      <h3>Selected Items</h3>
      <ul>
        {selectedDishes.map((dish, index) => (
          <li key={index}>{dish.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedItems;
