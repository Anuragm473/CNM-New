import React from "react";
import Styles from "./IncreaseQuantity.module.css";
import Table from "../table/Table";

export default function IncreaseQuantity({
  duplicate,
  updatedQuantities,
  setUpdatedQuantities,
  closeModal,
  storageObject,
  setStorageObject,
  menusData,
}) {
  // Calculate the total item counts for each menu category
  const itemCounts = menusData.map((category) =>
    category.items.reduce((acc, item) => acc + item.items.length, 0)
  );


  // Handle form submission
  const handleSubmit = () => {
    const updatedStorageObject = storageObject.map((item, index) => ({
      ...item,
      addon: updatedQuantities[index]+item.quantity <= itemCounts[index] 
        ? updatedQuantities[index] 
        : item.addon,
      quantity:duplicate[index].quantity+updatedQuantities[index]
      
      
    }));
    setStorageObject(updatedStorageObject);
    closeModal();
  };

  return (
    <div>
      <h3>Add on Menus</h3>
      <table className={Styles.menutable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Menu Title</th>
            <th>Price</th>
            <th>Add Extra Menu</th>
          </tr>
        </thead>
        <tbody>
          {storageObject.map((item, index) => (
            <Table
              key={item._id}
              index={index}
              item={item}
              value={updatedQuantities[index] || 0} // Default to 0 if value is undefined
              setUpdatedQuantities={setUpdatedQuantities}
            />
          ))}
        </tbody>
      </table>
      <button className={Styles.botn} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
