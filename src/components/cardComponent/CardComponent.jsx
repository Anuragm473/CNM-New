import React from 'react'
import styles from './CardComponent.module.css'

export default function CardComponent({heading,paragrapg,image}) {
  return (
    <div className={styles.container}>
      <img src={image} className={styles.image}/>
      <h5 className={styles.heading}>{heading}</h5>
      <p className={styles.paragrapg}>{paragrapg}</p>
      <div className={styles.arrowContainer}>
      <div className={styles.blueCircle}><ion-icon name="arrow-forward-outline"></ion-icon></div>
      </div>
    </div>
  )
}
