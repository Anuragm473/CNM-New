import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Profilepage.module.css";
import { getFromLocalStorage } from "../../../utility";
import { toast } from "react-toastify";

const Profilepage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    userId: "",
  });

  useEffect(()=>{
    document.title='Birthday Party Catering Services Near Me'
  },[])

  useEffect(()=>{async function getData(){
    const {id}=getFromLocalStorage("user");
    let user=await axios.get(`https://www.caterersnearme.in/api/users/${id}`)
    user=user.data
    setUserData(prev=>{
        return {...prev,userId:user.id,firstName:user.firstName,lastName:user.lastName,phone:user.phone,email:user.email}})
    }
    getData()
},[])

  const [userImage, setUserImage] = useState(
    "https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, ...updatedData } = userData;

    try {
      const response = await axios.patch(
        `https://www.caterersnearme.in/api/users/${userId}`,
        updatedData
      );
      toast("Profile updated successfully!");
    } catch (error) {
      toast("Failed to update profile.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={userImage} alt="User" className={styles.image} />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            disabled={true}
            value={userData.firstName}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            disabled={true}
            value={userData.lastName}
            className={styles.input}
            required
          />
        </div>

        {/* Phone Number */}
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profilepage;
