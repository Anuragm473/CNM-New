import React, { useState, useEffect } from "react";
import styles from "./SideBar.module.css";
import Modal from "../Modal/Modal";
import IncreaseQuantity from "../IncreaseQuantity/IncreaseQuantity";
import { getFromLocalStorage } from "../../../utility";

const SideBar = ({
  categories,
  selectedCategory,
  onCategorySelect,
  storageObject,
  setStorageObject,
  menusData,
  duplicate
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedQuantities, setUpdatedQuantities] = useState([]);

  useEffect(() => {
    // Update `updatedQuantities` whenever `storageObject` changes
    if (storageObject && storageObject.length > 0) {
      setUpdatedQuantities(storageObject.map(el=>el.addon));
    }
  }, [storageObject]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);



  return (
    <div className={styles.sidebar}>
      <div className={styles.steps}>Step-1</div>
      <div className={styles.container}>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <IncreaseQuantity
        duplicate={duplicate}
          menusData={menusData}
          updatedQuantities={updatedQuantities}
          setUpdatedQuantities={setUpdatedQuantities}
          closeModal={closeModal}
          setStorageObject={setStorageObject}
          storageObject={storageObject}
        />
      </Modal>
      <div className={styles.category}>
        <h3>Menu for {getFromLocalStorage("dishDetails").name}</h3>
        <button className={styles.btn} onClick={openModal}>
          Add an Extra Item <span>&#43;</span>
        </button>
      </div>
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            className={selectedCategory === category ? styles.selected : ""}
            onClick={() => onCategorySelect(category)}
          >
            <div className={styles.category}>
              {category}{" "}
              <span className={styles.quantity}>
                {storageObject[index]?.quantity>0?`Select any ${storageObject[index]?.quantity || 0}`:`Add an Item` }
              </span>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default SideBar;
