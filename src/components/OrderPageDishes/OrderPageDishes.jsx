import React, { useState } from "react";
import styles from "./OrderPageDishes.module.css";
import orderDish from "../../assets/images/dish.webp";
import { useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "../../../utility";

const OrderPageDishes = ({ dishes }) => {
  const navigate = useNavigate();
  const [hoveredDish, setHoveredDish] = useState(null); // Track the hovered dish

  const handleDishClick = (dish) => {
    saveToLocalStorage("dishDetails", dish);
    navigate(`/add-to-cart/${dish.id}`);
  };
  console.log(dishes)
  return (
    <div className={styles.orderPageDishes}>
      <div className={styles.dishes}>
        {dishes?.map((dish, index) => (
          <div
            className={styles.dish}
            key={index}
            onClick={() => handleDishClick(dish)}
            onMouseEnter={() => setHoveredDish(dish.id)} // Set hovered dish on mouse enter
            onMouseLeave={() => setHoveredDish(null)} // Clear hovered dish on mouse leave
          >
            <div className={styles.imageContainer}>
              <img
                className={styles.image}
                src={dish.imageUrl || orderDish}
                alt="dish image"
              />
            
            <span
              className={
                dish.dishType.toLowerCase() === "veg"
                  ? styles.veg
                  : styles.nonVeg
              }
            >
              {dish.dishType.toLowerCase() === "veg" ? "Veg" : "Non-Veg"}
            </span>
            <h3 className={styles.price}>{dish.price}</h3>


            {/* Show the dish name as an overlay on hover */}
            <div className={styles.hoverNameContainer}>
              {hoveredDish === dish.id && (
                <ul className={styles.hoverName}>{dish.items.map(item=>
                  <li className={styles.name} key={item.id}>{item.item}: <span className={styles.quantity}>{item.quantity}</span></li>
                )}</ul>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPageDishes;
