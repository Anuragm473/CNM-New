import React, { useContext, useEffect, useRef } from "react";
import styles from "./AboutUsSection.module.css";
import { useNavigate } from "react-router-dom";
import CardComponent from "../cardComponent/CardComponent";
import { CatererContext } from "../../CatererContext";
import { saveToLocalStorage } from "../../../utility";
import { getCurrentUserLocation } from "../../pages/CatererSearch/CatererSearch";
import home1 from "../../assets/images/home1.png"
import home2 from "../../assets/images/home2.png"
import home3 from "../../assets/images/home3.png"
import searchIcon from "../../assets/images/search.svg"
import axios from "axios";

const AboutUsSection = () => {
  const autocompleteRef = useRef(null);
  const {radius,setCaterers,setFilteredCaterers,searchQuery,setSearchQuery,setIsAddressSearch, selectedPeopleRange, setSelectedPeopleRange } =
    useContext(CatererContext);
    const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const cardObj = [
    {
      heading: "Select your Location",
      paragraph: "Find top-rated caterers near you by selecting your city.",
      image:home1
    },
    {
      heading: "Choose a Service",
      paragraph: "Select the catering service that matches your needs.",
      image:home2
    },
    {
      heading: "Book top caterers",
      paragraph: "Find and connect with caterers that suit your needs.",
      image:home3
    },
  ];

  const handlePlaceSelect = () => {
    const addressObject = autocompleteRef.current.getPlace();
    const address = addressObject.formatted_address;
    setSearchQuery(address);
    setIsAddressSearch(true);

    const { lat, lng } = addressObject.geometry.location;
    fetchNearbyCaterers(lat(), lng());
  };

  const initAutocomplete = () => {
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      document.getElementById("unified-search-input"),
      {
        types: ["establishment"], // This includes apartments, buildings, gardens, etc.
        componentRestrictions: { country: "in" }, // Restrict results to India (use your desired country code)
      }
    );
  
    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
  
};

const fetchNearbyCaterers = async (lat, lng) => {
  try {
    const response = await axiosPrivate.get(
      `https://www.caterersnearme.in/api/caterer/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    if (Array.isArray(response.data)) {
      setCaterers(response.data);
      setFilteredCaterers(response.data);
      setCurrentPage(1);
    } else {
      console.error("API response is not an array:", response.data);
    }
  } catch (error) {
    console.error("Error fetching nearby caterers:", error);
  }
};

  useEffect(() => {
    const fetchCaterers = async () => {
      try {
        const { lat, lng } = await getCurrentUserLocation();

        const response = await axios.get(
          `https://www.caterersnearme.in/api/caterer/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );

        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setCaterers(data);
          setFilteredCaterers(data);
        } else {
          fetchFallbackCaterers();
        }
      } catch (error) {
        console.error("Error fetching nearby caterers:", error);
        fetchFallbackCaterers();
      }
    };

    const fetchFallbackCaterers = async () => {
      try {
        const response = await axios.get(
          "https://www.caterersnearme.in/api/caterer"
        );
        const data = response.data.data;
        if (Array.isArray(data)) {
          setCaterers(data);
          setFilteredCaterers(data);
        }
      } catch (error) {
        console.error("Error fetching fallback caterers:", error);
      }
    };

    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    };

    fetchCaterers();
    loadGoogleMapsScript();
  }, [radius]);

  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.primaryHeading}>
        Local Flavors, Global Standards Welcome to Caterersnearme!
      </div>
      <p className={styles.secondaryHeading}>
        Your trusted destination for finding reliable and exceptional catering
        services tailored to meet every need and occasion.{" "}
      </p>
      <div className={styles.inputFeilds}>
        <input
        id="unified-search-input"
          type="text"
          placeholder="Select Your Location"
          className={styles.inputFeild}
          value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsAddressSearch(false);
              }}
        />
        <select
          className={styles.inputFeild}
          value={selectedPeopleRange}
              onChange={(e) => {
                saveToLocalStorage('numberOfPeople',e.target.value)
                setSelectedPeopleRange(e.target.value)}}
        >
          <option value="">Select Number Of People</option>
          <option value="10-25">10 to 25 People</option>
          <option value="25-50">25 to 50 People</option>
          <option value="50-100">50 to 100 People</option>
          <option value="100+">100+ People</option>
        </select>
        <button onClick={()=>navigate('/caterer')} className={styles.searchButton}>
          <span className={styles.searchIcon}><img src={searchIcon} alt='search icon'/></span>
          <span>SEARCH</span>
        </button>
      </div>
      <div className={styles.cardComponent}>
        {cardObj.map((card) => (
          <CardComponent heading={card.heading} paragrapg={card.paragraph} image={card.image}/>
        ))}
      </div>
      <div className={styles.leftBox}></div>
      <div className={styles.rightBox}></div>
      <div className={styles.circle}></div>
    </div>
  );
};

export default AboutUsSection;
