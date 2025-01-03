import React from 'react';
import styles from './ServicesOffers.module.css';
import cake from './../../assets/images/cake.png'

const services = [
  "Weddings",
  "Birthday Parties",
  "Kitty Parties",
  "Small Get-Togethers",
  "Corporate Events",
  "Mehendi Ceremony",
  "Sangeet Ceremony",
  "Baby Shower",
  "Haldi Ceremony",
  "Pooja",
  "Society Functions",
  "Baby Naming Ceremony",
  "Any Other Gatherings",
];

const ServicesOffers = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Best Services Offers</h2>
      <div className={styles.grid}>
        {services.map((service, index) => (
            
          <div
            key={index}
            className={`${styles.serviceItem}`}
          >
            <div className={styles.iconWrapper}>
              <img
                src={cake} // Replace with the correct path to the cake icon
                alt="Service Icon"
                className={styles.icon}
              />
            </div>
            <p className={styles.serviceText}>{service}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesOffers;
