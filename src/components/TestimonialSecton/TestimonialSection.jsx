import React from 'react';
import styles from './TestimonialSection.module.css';
import gallery1 from "../../assets/gallery/gallery-1.jpg"
import testimonial1 from "../../assets/customers/testimonial1.jpeg"
import default1 from "../../assets/customers/default.jpg"
import video1 from "../../assets/video/video.mp4"
import video2 from "../../assets/video/video2.mp4"


const TestimonialSection = () => {
  return (
    <section className={styles.sectionTestimonial} id="testimonials">
      <div className={styles.testimonialContainer}>
        <span className={styles.subheading}>Testimonials</span>
        <h2 className={styles.secondaryHeading}>Once You Try It, You Can't Go Back</h2>
        <div className={styles.forFlex}>
        <div className={styles.testimonial}>
          {[
            {
              img: testimonial1,
              text: "Agrify Fresh recently availed catering services through Caterersnearme, an aggregator for caterers in Mumbai, for our team gathering. The experience was seamless and professional, with a wide range of options to suit various preferences and dietary requirements. The food quality was excellent, delivered on time, and the staff ensured everything was well-organized. The platform made it easy to compare and choose the right caterer for our needs. Highly recommend Caterersnearme for hassle-free event planning!",
              name: "Darpan Bendre, CEO - Agrify Fresh",
            },
            {
              img: default1,
              text: "Thaipeeth is nice in taste and also curd is good 🙏 Thank you for your efforts to arrange this on short notice. Once again thank you so much",
              name: "Mandakini Awate",
            },
            {
              img: default1,
              text: "We loved the food.. it was really good…Even mom and the guests appreciated it",
              name: "Archana Padwal",
            },
            {
              img: default1,
              text: "The food was very good. Thank you 😊",
              name: "Urmila Shah",
            },
          ].map(({ img, text, name }, idx) => (
            <figure className={styles.testimonialBox} key={idx}>
              <img src={img} alt={`${name} image`} className={styles.testimonialImg} />
              <blockquote className={styles.testimonialText}>{text}</blockquote>
              <p className={styles.testimonialName}>&mdash; {name}</p>
            </figure>
          ))}
        </div>
        <div className={styles.gallery}>
        <video
        height="800"
        controls
        autoPlay
        muted
        loop
        style={{ borderRadius: "10px" }}
      >
        <source src={video2} type="video/mp4" />
      </video>
      </div>
      </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
