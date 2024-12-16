import React, { useEffect, useState } from 'react';
import styles from './ContactUs.module.css';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact:"",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(()=>{
    document.title='Expert Sangeet Catering Services'
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name:`${formData.firstName} ${formData.lastName}`,
      email:formData.email,
      message:formData.message,
      contact:formData.contact
    };

    emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_USER_ID)
      .then((response) => {
        toast('Message sent successfully!'); // Notify user
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contact:"",
          message: "",
        });
      })
      .catch((error) => {
        toast('Something went wrong, please try again.');
      });
  };

  return (
    <>
    <h1 className={styles.heading}>Contact Us</h1>
    <div className={styles.container}>
      <div className={styles.description}>
        <p className={styles.paragraph}>Caterersnearme.in is a one stop solution for all your catering needs. From small get-togethers to weddings we cover all your precious occasions. Today with more than 25 registered caterers, we allow you to compare, taste, order, rate and review your experience.</p>

        <p className={styles.paragraph}>Meals starting at Rs 99/- Per Person</p>

        <p className={styles.paragraph}>For Orders and Enquires Call or Whatsapp us on   +91 9321291563 or fill the form to the right.</p>

          <p className={styles.paragraph}>Looking forward to providing you a delightful experience!</p>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name (Required)"
              required
              className={styles.input}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name (Required)"
              required
              className={styles.input}
            />
          </div>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Contact Number (Required)"
            required
            className={styles.input}
          />
          <input
            type="input"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email (Required)"
            required
            className={styles.input}
          />
          <textarea
            name="Message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Message"
            className={styles.textarea}
          ></textarea>
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
