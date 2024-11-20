import React, { useState } from 'react';

export default function Table({
  item,
  index,
  setUpdatedQuantities,
  value
}) {
  const min = 0;
  const max = 10;

  // Use the value from updatedQuantities as the initial state for localValue
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    if (newValue >= min && newValue <= max) {
      setLocalValue(newValue);
      setUpdatedQuantities((prev) =>
        prev.map((el, idx) => (idx === index ? newValue : el))
      );
    } else {
      alert(`Please enter a number between ${min} and ${max}`);
    }
  };

  const addItem = () => {
    if (localValue < max) {
      const newValue = localValue + 1;
      setLocalValue(newValue);
      setUpdatedQuantities((prev) =>
        prev.map((el, idx) => (idx === index ? newValue : el))
      );
    } else {
      alert(`Please enter a number between ${min} and ${max}`);
    }
  };

  const subtractItem = () => {
    if (localValue > min) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      setUpdatedQuantities((prev) =>
        prev.map((el, idx) => (idx === index ? newValue : el))
      );
    } else {
      alert(`Please enter a number between ${min} and ${max}`);
    }
  };

  return (
    <tr
      style={{
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
      }}
    >
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>
        <button onClick={subtractItem}>-</button>
        <input
          value={localValue}
          onChange={handleChange}
          type="number"
          min={min}
          max={max}
        />
        <button onClick={addItem}>+</button>
      </td>
    </tr>
  );
}
