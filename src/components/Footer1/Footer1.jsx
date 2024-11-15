import React, { useState } from "react";
import styles from "./Footer1.module.css";
import CNMlogo from '../../assets/CNMLogo-NoBG.png'

export default function Footer1() {
    const curretDate=new Date().getFullYear()
  return (
    <footer className={styles.footer}>
    <div className={`${styles.container} ${styles.gridcols}`}>
        <div className={styles.logocol}>
            <a href="#" className={styles.footerlogo}>
                <img src={CNMlogo} alt="logo" className={styles.logo} />
                <span className={styles.logoheading}>CATERERSNEARME</span>
            </a>
            <ul className={styles.sociallink}>
                <li>
                    <a className={styles.footerlink1} href="https://www.instagram.com/caterersnearme.in/"><ion-icon className={styles.sociallinks} name="logo-instagram"></ion-icon></a>
                </li>
                <li>
                    <a className={styles.footerlink1} href="https://www.linkedin.com/company/caterersnearme"><ion-icon className={styles.sociallinks} name="logo-linkedin"></ion-icon></a>
                </li>
                <li>
                    <a className={styles.footerlink1} href="#"><ion-icon className={styles.sociallinks} name="logo-facebook"></ion-icon></a>
                </li>
            </ul>
            <p className={styles.copyright}>Copyright &copy; <span className={styles.year}>{curretDate}</span> by Caterersnearme, Inc. All rights reserved.</p>
        </div>
        <div className={styles.addresscol}>
            <p className={styles.footerheading}>Contact Us</p>
            <address className={styles.contacts}>
                <p className={styles.address}>Andher west</p>
                <a className={styles.footerlink} href="tel:+91 9321291563">+91 9321291563</a>
                <a className={styles.footerlink} href="mailto:caterersnearme@gmail.com">caterersnearme@gmail.com</a>
            </address>
        </div>
        <nav className={styles.navcol}>
            <p className={styles.footerheading}>Account</p>
            <ul className={styles.footernav}>
                <li><a className={styles.footerlink} href="#">Create account</a></li>
                <li><a className={styles.footerlink} href="#">Sign in</a></li>
            </ul>
        </nav>
        {/* <nav className={styles.navcol}>
            <p className={styles.footerheading}>Company</p>
            <ul className={styles.footernav}>
                <li><a className={styles.footerlink} href="#">About Caterersnearme</a></li>
                <li><a className={styles.footerlink} href="#">For Business</a></li>
                <li><a className={styles.footerlink} href="#">Catering partners</a></li>
            </ul>
        </nav> */}
        {/* <nav className={styles.navcol}>
            <p className={styles.footerheading}>Resource</p>
            <ul className={styles.footernav}>
                <li><a className={styles.footerlink} href="#">Help center</a></li>
                <li><a className={styles.footerlink} href="#">Privacy & terms</a></li>
            </ul>
        </nav> */}
    </div>
</footer>
  );
}