import React from 'react'
import reviewImg from '../../assets/images/review.jpeg'
import styles from './Review.module.css'

export default function Review({ maxWidth = '350px', rating = 4, comment = 'null' }) {
  // Create an array of length `rating` to render the stars
  const stars = Array.from({ length: rating }, (_, index) => index);

  return (
    <div style={{ maxWidth }} className={styles.reviewCard}>
      <img
        src={reviewImg} // Replace with the actual image URL
        alt="James Pattinson"
        className={styles.profileImage}
      />
      <h3 className={styles.name}>James Pattinson</h3>
      <div className={styles.stars}>
        {/* Map over the stars array to render filled stars */}
        {stars.map(() => (
          <span key={Math.random()} className={`${styles.star} ${styles.filled}`}>★</span>
        ))}
      </div>
      <p className={styles.reviewText}>
        {comment}
      </p>
    </div>
  )
}
