import React from 'react'
import styles from './ArtGallery.module.css'
import img1 from '../../assets/images/special1.jpeg'
import img2 from '../../assets/images/special2.jpeg'
import img3 from '../../assets/images/special3.jpeg'
import img4 from '../../assets/images/special4.jpeg'
import img5 from '../../assets/images/special5.jpeg'
import img6 from '../../assets/images/special6.jpeg'
import img7 from '../../assets/images/special7.jpeg'
import img8 from '../../assets/images/special8.jpeg'
import img9 from '../../assets/images/special9.jpeg'

export default function ArtGallery() {
  return (
    <div className={styles.container}>
        <h1 className={styles.header}>The Art of Catering: A Gallery of Caterersnearme’s Menu Dishes</h1>
        <div className={styles.gridContainer}>
        <div className={styles.flexContainer}>
            <img className={styles.flexImg} style={{height:'235px'}} src={img1} alt="vada pav image" />
            <img className={styles.flexImg} style={{height:'420px'}} src={img2} alt="dish image" />
            <img className={styles.flexImg} style={{height:'420px'}} src={img3} alt="dish image" />
        </div>
        <div className={styles.flexContainer}>
            <img className={styles.flexImg} style={{height:'313px'}} src={img4} alt="dish image" />
            <img className={styles.flexImg} style={{height:'313px'}} src={img5} alt="dish image" />
            <img className={styles.flexImg} style={{height:'313px'}} src={img6} alt="dish image" />
        </div>
        <div className={styles.flexContainer}>
            <img className={styles.flexImg} style={{height:'420px'}} src={img7} alt="dish image" />
            <img className={styles.flexImg} style={{height:'420px'}} src={img8} alt="dish image" />
            <img className={styles.flexImg} style={{height:'176px'}} src={img9} alt="dish image" />
        </div>
        </div>
    </div>
  )
}
