import styles from './Howitwork.module.css';
import step1 from '../../assets/images/step1.png'
import step2 from '../../assets/images/step2.png'
import step3 from '../../assets/images/step3.png'
import step4 from '../../assets/images/step4.png'

const Howitwork = () => {
  return (
    <section className={styles.sectionHow} id="how-it-works">
      <div className={`${styles.container} ${styles.grid} ${styles.grid2Cols}`}>
        <div className={styles.topHeading}>
          <h2 className={styles.headingSecondary}>Order now in 4 simple steps</h2>
        </div>
        <div className={`${styles.grid} ${styles.grid3Cols} ${styles.gridStart}`}>
          {/* Step 1 */}
          <div className={styles.box1}>
            <div className={styles.grid3c}>
            <p className={styles.stepNumber}>01</p>
            <h3 className={styles.headingTertiary}>Navigate to “Find Caterers” at the top of our page.</h3>
            {/* <p className={styles.stepDescription}>
              Select from a variety of healthy meal options tailored to your needs.
            </p> */}
            </div>
            <div className={styles.stepImgBox}>
              <img
                src={step1}
                alt="Choose your meal plan"
                className={styles.stepImg}
              />
            </div>
          </div>
          {/* Step 2 */}
          <div className={styles.box2}>

            <div className={styles.stepImgBox}>
              <img
                src={step2}
                alt="Order and relax"
                className={styles.stepImg}
              />
            </div>
            <div className={styles.grid3c}>
            <p className={styles.stepNumber}>02</p>
            <h3 className={styles.headingTertiary}>Enter Your Event Location and view the menu of the available caterers.</h3>
            {/* <p className={styles.stepDescription}>
              Place your order online and let us handle the rest.
            </p> */}
            </div>
          </div>
          {/* Step 3 */}
          <div className={styles.box3}>
            
            <div className={styles.grid3c}>
            <p className={styles.stepNumber}>03</p>
            <h3 className={styles.headingTertiary}>Log in or Create an Account to get started.</h3>
            {/* <p className={styles.stepDescription}>
              Savor freshly prepared meals delivered to your doorstep.
            </p> */}
            </div>
            <div className={styles.stepImgBox}>
              <img
                src={step3}
                alt="Enjoy your meals"
                className={styles.stepImg}
              />
            </div>
          </div>
          <div className={styles.box4}>

            <div className={styles.stepImgBox}>
              <img
                src={step4}
                alt="Order and relax"
                className={styles.stepImg}
              />
            </div>
            <div className={styles.grid3c}>
            <p className={styles.stepNumber}>04</p>
            <h3 className={styles.headingTertiary}>Place Your Order and leave the rest to us!</h3>
            {/* <p className={styles.stepDescription}>
              Place your order online and let us handle the rest.
            </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Howitwork;
