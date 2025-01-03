import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import styles from "./Reviews.module.css";
import Review from "../Review/Review";

const Reviews = ({ reviews }) => {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const responses = await Promise.all(
          reviews.map((id) =>
            axios.get(`https://www.caterersnearme.in/api/reviews/${id}`)
          )
        );
        setReviewData(responses.map((response) => response.data)); // Extract data from responses
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [reviews]); // Add reviews as a dependency to re-run when `reviews` changes

  return (
    <div className={styles.reviews}>
      <h3 className={styles.heading}>Reviews</h3>
      <div className={styles.reviewContainer}>
        {reviewData.map((review, index) => (
          <div className={styles.review} key={index}>
            <Review maxWidth='250px' rating={reviewData[index].rating} comment={reviewData[index].comment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
