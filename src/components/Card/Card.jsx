import React from "react";
import styles from "./Card.module.css";
import StarRating from '../startRating/StarRating'
import orderDish from "../../assets/icons/orderDish.png";

const Card = ({ catererName, tagline, serviceStartYear,rating}) => {
  return (
    <div className={styles.card}>
      <div className={styles.catererInfo}>
        <h1 className={styles.header}>{catererName}</h1>
        <p className={styles.tagline}>{tagline}</p>
        <p className={styles.taglines}>Been in Service Since: {serviceStartYear}</p>
        <div className={styles.rating}><span>Rating : </span><StarRating size={24} color={'#F79B4A'} defaultRating={rating || 0}/></div>
      </div>
    </div>
  );
};

export default Card;
