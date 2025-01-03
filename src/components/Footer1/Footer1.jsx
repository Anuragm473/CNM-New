import React, { useContext, useState } from "react";
import styles from "./Footer1.module.css";
import CNMlogo from '../../assets/CNMLogo-NoBG.png'
import {CatererContext} from "../../CatererContext"

export default function Footer1() {
    const {setIsModalOpen}=useContext(CatererContext)
    const curretDate=new Date().getFullYear()
  return (
    <footer className={styles.footer}>
    <div className={`${styles.container} ${styles.gridcols}`}>
        <div className={styles.logocol}>
            <a href="#" className={styles.footerlogo}>
                <img src={CNMlogo} alt="logo" className={styles.logo} />
                <span className={styles.logoheading}>CATERERSNEARME</span>
            </a>
            <p className={styles.copyright}>All orders are fulfilled by the respective caterers. Caterersnearme.in is only a platform for selection of caterers and is not responsible for the quality or service provided by the caterers.</p>
            <ul className={styles.sociallink}>
                <li>
                    <a className={styles.footerlink1} href="https://www.instagram.com/caterersnearme.in/"><ion-icon className={styles.sociallinks} name="logo-instagram"></ion-icon></a>
                </li>
                <li>
                    <a className={styles.footerlink1} href="https://www.linkedin.com/company/caterersnearme"><ion-icon className={styles.sociallinks} name="logo-linkedin"></ion-icon></a>
                </li>
            </ul>
        </div>
        <div className={styles.addresscol}>
            <p className={styles.footerheading}>Company</p>
            <address className={styles.contacts}>
                <p className={styles.address}>Atal Incubation Center, 1st Floor, NMIMS Management Building, Vile Parle West, Mumbai - 400056</p>
                <a className={styles.footerlink} href="tel:+91 9321291563">+91 9321291563</a>
                <a className={styles.footerlink} href="mailto:caterersnearme@gmail.com">caterersnearme@gmail.com</a>
            </address>
        </div>
        <nav className={styles.navcol}>
            <p className={styles.footerheading}>Account</p>
            <ul className={styles.footernav}>
                <li onClick={()=>setIsModalOpen(true)}><a className={styles.footerlink} href="#">Create account</a></li>
                <li onClick={()=>setIsModalOpen(true)}><a className={styles.footerlink} href="#">Sign in</a></li>
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
    <p className={styles.copyrights}>Copyright &copy; <span className={styles.year}>{curretDate}</span> by Caterersnearme, Inc. All rights reserved.</p>
</footer>
  );
}