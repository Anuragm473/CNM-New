import React from "react";
import styles from './WhyCaterernearme.module.css'
import SangeetDish from "../../assets/images/SangeetDish.jpeg";
import { useNavigate } from "react-router-dom";

import aboutusimg from "../../assets/images/aboutusimg.jpeg";
import whycnm from '../../assets/cnm_Images/whycnm.jpg'

const AboutUsNew = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>Why Caterersnearme</h1>
      <div className={styles.aboutUsSection}>
        <div className={styles.aboutUsLeft}>
          {/* <h1>Why Caterernearme</h1> */}
          <p>
            We prioritize hygiene and professionalism at every event. All
            catering staff come well-dressed in clean, appropriate attire,
            including chef hats, gloves, and masks when needed. This attention
            to detail ensures our clients experience not only delicious food but
            also a high standard of safety and care. With easy-to-use filters
            for cuisine, dietary needs, and budget, you can confidently book and
            enjoy a hassle-free event. And with real customer reviews, you can
            rely on the experiences of others to make informed choices. At
            Caterersnearme, we’re more than just a platform—we’re here to
            elevate every celebration with unforgettable flavors and reliable
            service.
          </p>
          <button
            onClick={() => navigate("/caterer")}
            className={styles.aboutUsBtn}
          >
            Find Caterer
          </button>
        </div>
        <div className={styles.aboutUsRight}>
          <div className={styles.aboutUsImageContainer}>
            <img
              className={styles.aboutUsImage}
              src={whycnm}
              alt="Catering"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsNew;
