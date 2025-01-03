import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./Personal.module.css";
import axios from "axios";
import { CatererContext } from "../../CatererContext";
import { getFromLocalStorage, saveToLocalStorage, toastMessage } from "../../../utility";
import { formatDate } from "../../../utility";

export default function Personal({ setCurrentStep }) {
  const { catererId, setCatererId } = useContext(CatererContext);
  const [initial, setInitial] = useState();
  const [serviceLocat, setServiceLocat] = useState([
    {
      location: "",
      PinCode: 0,
    },
  ]);

  const cuisinesOptions = [
    "North Indian",
    "South Indian",
    "Maharashtrian",
    "Chinese",
    "Italian",
    "Gujarati",
    "Kathiyawadi",
    "Punjabi",
    "Jain",
    "Kokani",
    "Mexican"
  ]; // Example options

  const [formData, setFormData] = useState({
    name: "",
    gstNo: "",
    address: "",
    mobileNo: 0,
    extraInformation: "",
    review: [],
    dishes: [],
    specialistIn: "",
    cuisinesOffered: [],
    inServiceFrom: "",
    cateringType: [],
    maximumServingCapacity: 0,
    googleLocation: {
      lat: "",
      lng: "",
    },
    serviceLocation: serviceLocat,
    maxPrice: 0,
    minPrice: 0,
    status: {
      id: 1,
    },
  });

  const addressInputRef = useRef(null);

  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAUD63maRlEe3fqMDi4ZTrspkP_vVVgcGo&libraries=places`;
      script.async = true;
      script.onload = () => initAutocomplete();
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  };

  const initAutocomplete = () => {
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          setFormData((prevData) => ({
            ...prevData,
            address: place.formatted_address,
            googleLocation: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          }));
        }
      });
    }
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "maximumServingCapacity" ||
      name === "maxPrice" ||
      name === "minPrice" ||
      name === "mobileNo"
    ) {
      setFormData({ ...formData, [name]: Number(value) });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedCuisines = checked
        ? [...prevState.cuisinesOffered, value]
        : prevState.cuisinesOffered.filter((cuisine) => cuisine !== value);
      return { ...prevState, cuisinesOffered: updatedCuisines };
    });
  };

  const handleCheckboxChangeCatering = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedCuisines = checked
        ? [...prevState.cateringType, value]
        : prevState.cateringType.filter((cuisine) => cuisine !== value);
      return { ...prevState, cateringType: updatedCuisines };
    });
  };

  useEffect(() => {
    const storage = getFromLocalStorage("catererData");
    if (catererId === "" && storage) {
      setCatererId(JSON.parse(storage));
    }
  }, [catererId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getFromLocalStorage("user");
        const catererid = user.catererId;
        if (catererid) {
          const response = await axios.get(
            `https://www.caterersnearme.in/api/caterer/${catererid}`
          );
          let data = response.data;
          data.inServiceFrom = formatDate(data.inServiceFrom);
          setInitial(JSON.parse(JSON.stringify(data)));
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching caterer data:", error);
      }
    };

    fetchData();
  }, [catererId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user=getFromLocalStorage('user')
      const {catererId}=user
      const updatedFields = getUpdatedFields(formData, initial);
      if(catererId){
        const response = await axios.patch(
          `https://www.caterersnearme.in/api/caterer/${catererId}`,
          updatedFields
        );
      }else{
        const response = await axios.post(
          `https://www.caterersnearme.in/api/caterer`,
          updatedFields
        );
        const catererResponse=await axios.patch(`https://www.caterersnearme.in/api/users/${user.id}`,{catererId:response.data.id})
        saveToLocalStorage('user',{...user,catererId:response.data.id})
      }
      
      toastMessage("Updated successfully!");
      setCurrentStep(2);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const getUpdatedFields = (formData, initialState) => {
    let updatedFields = {};
  
    // If initialState is provided, compare formData with it
    if (initialState) {
      Object.keys(formData).forEach((key) => {
        // Check for differences between formData and initialState
        if (JSON.stringify(formData[key]) !== JSON.stringify(initialState[key])) {
          updatedFields[key] = formData[key];
        }
      });
    } else {
      // If no initialState, return the entire formData
      updatedFields = { ...formData };
    }
  
    return updatedFields;
  };
  

  return (
    <form className={styles.catererForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="gstNo">GST Number</label>
        <input
          type="text"
          id="gstNo"
          name="gstNo"
          value={formData.gstNo}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          ref={addressInputRef}
          value={formData.address}
          onChange={handleChange}
          placeholder="Start typing an address..."
          required
        />
      </div>

      {/* <div className={styles.formGroup}>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div> */}

      <div className={styles.formGroup}>
        <label htmlFor="mobileNo">Mobile Number</label>
        <input
          type="tel"
          id="mobileNo"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="extraInformation">Extra Information</label>
        <textarea
          id="extraInformation"
          name="extraInformation"
          value={formData.extraInformation}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialistIn">Specialist In</label>
        <input
          type="text"
          id="specialistIn"
          name="specialistIn"
          value={formData.specialistIn}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Cuisines Offered</label>
        <div className={styles.checkboxGroupcusine}>
          {cuisinesOptions.map((cuisine) => (
            <div key={cuisine} className={styles.checkboxItemcusine}>
              <input
                type="checkbox"
                value={cuisine}
                onChange={handleCheckboxChange}
                checked={formData.cuisinesOffered.includes(cuisine)}
              />
              <label>{cuisine}</label>
            </div>
          ))}
        </div>
        </div>

      <div className={styles.formGroup}>
        <label htmlFor="inServiceFrom">In Service From</label>
        <input
          type="date"
          id="inServiceFrom"
          name="inServiceFrom"
          value={formData.inServiceFrom}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Catering Type</label>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            value="veg"
            onChange={handleCheckboxChangeCatering}
            checked={formData?.cateringType?.includes("veg")}
          />{" "}
          <label>Veg</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            value="nonVeg"
            onChange={handleCheckboxChangeCatering}
            checked={formData?.cateringType?.includes("nonVeg")}
          />{" "}
          <label>Non Veg</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            value="jain"
            onChange={handleCheckboxChangeCatering}
            checked={formData?.cateringType?.includes("jain")}
          />{" "}
          <label>Jain</label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Google Location</label>
        <div>
          <div className={styles.googleGroup}>
            <label htmlFor="lat">Latitude</label>
            <input
              type="number"
              id="lat"
              name="lat"
              value={formData.googleLocation.lat}
              readOnly
            />
            <label htmlFor="lng">Longitude</label>
            <input
              type="number"
              id="lng"
              name="lng"
              value={formData.googleLocation.lng}
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="maximumServingCapacity">Maximum Serving Capacity</label>
        <input
          type="number"
          id="maximumServingCapacity"
          name="maximumServingCapacity"
          value={formData.maximumServingCapacity}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="maxPrice">Maximum Price</label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={formData.maxPrice}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="minPrice">Minimum Price</label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={formData.minPrice}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
}
