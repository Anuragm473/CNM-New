import React, { useState } from 'react';
import styles from './FoodOffers.module.css';
import italian from '../../assets/images/italian.png';
import maha from '../../assets/images/maha.png';
import north from '../../assets/images/north.png';
import south from '../../assets/images/south.png';
import gujrat from '../../assets/images/gujrat.png';

const foodOffers = [
  { name: 'Italian', image: italian },
  { name: 'Maharashtrian', image: maha },
  { name: 'North Indian', image: north },
  { name: 'South Indian', image: south },
  { name: 'Gujarati', image: gujrat },
  { name: 'Gujarati', image: gujrat },
  { name: 'Gujarati', image: gujrat },
  { name: 'Gujarati', image: gujrat },
];

const ITEMS_PER_PAGE = 5; // Number of items to show at a time

const FoodOffers = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < foodOffers.length) {
      setCurrentIndex(currentIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - ITEMS_PER_PAGE);
    }
  };

  const visibleOffers = foodOffers.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Best Food Offers</h2>
      <div className={styles.foodGrid}>
        {visibleOffers.map((offer, index) => (
          <div key={index} className={styles.foodCard}>
            <img src={offer.image} alt={offer.name} className={styles.foodImage} />
            <p className={styles.foodName}>{offer.name}</p>
          </div>
        ))}
      </div>
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>
        <button
          className={styles.navButton}
          onClick={handleNext}
          disabled={currentIndex + ITEMS_PER_PAGE >= foodOffers.length}
        >
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
};

export default FoodOffers;
