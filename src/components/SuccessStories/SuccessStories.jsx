import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './SuccessStories.module.css';
import img1 from '../../assets/cnm_Images/img1.jpg'
import img2 from '../../assets/cnm_Images/img2.jpg'
import img3 from '../../assets/cnm_Images/img3.jpg'
import img4 from '../../assets/cnm_Images/img4.jpg'

import img66 from '../../assets/cnm_Images/img66.jpg'
import img7 from '../../assets/cnm_Images/img7.jpg'
import img8 from '../../assets/cnm_Images/img8.jpg'

const SuccessStories = () => {
  const successStories = [
    {
      image: img1,
    //   name: 'Apolline Deo',
    //  title: 'Head Chef'
    },
    {
      image: img2,
    //   name: 'Robart Parker',
    //   title: 'Executive Chef'
    },
    {
      image: img3,
    //   name: 'Cathenna Sudh',
    //   title: 'Kitchen Porter'
    },
    {
      image: img4,
    //   name: 'Cathenna Sudh',
    //   title: 'Kitchen Porter'
    },
    {
      image: img66,
    //   name: 'Cathenna Sudh',
    //   title: 'Kitchen Porter'
    },
    {
      image: img7,
    //   name: 'Cathenna Sudh',
    //   title: 'Kitchen Porter'
    },
    {
      image: img8,
    //   name: 'Cathenna Sudh',
    //   title: 'Kitchen Porter'
    }
  ];

  return (
    <section className={styles.storySliderSection}>
      <div className={styles.storyContainer}>
        <div className={styles.storyHeadline}>
          {/* <h3>- Our Stories -</h3> */}
          <h2>- Taste, Trust, and Triumph: Our Event Journey -</h2>
        </div>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={2000}
          centerMode={true}
          centerSlidePercentage={33.33}
          emulateTouch={true}
          swipeable={true}
          dynamicHeight={false}
          responsive={{
            breakpoints: {
              320: {
                centerSlidePercentage: 100,
              },
              768: {
                centerSlidePercentage: 50,
              },
              1024: {
                centerSlidePercentage: 33.33,
              }
            }
          }}
          className={styles.storyCarousel}
        >
          {successStories.map((story, index) => (
            <div key={index} className={styles.storyCard}>
              <img src={story.image} alt={`Success Story - ${story.name}`} />
              <h4 className={styles.storyName}>{story.name}</h4>
              <span className={styles.storyTitle}>{story.title}</span>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default SuccessStories;