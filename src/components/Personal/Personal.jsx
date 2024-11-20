import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./Personal.module.css";
import axios from "axios";
import { CatererContext } from "../../CatererContext";
import { toastMessage } from "../../../utility";
import { formatDate } from "../../../utility";

export default function Personal({ setCurrentStep }) {
  const { catererId, setCatererId } = useContext(CatererContext);
  const [initial,setInitial]=useState()
  const [serviceLocat, setServiceLocat] = useState([
    {
      location: "",
      PinCode: 0,
    },
  ]);

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

  // Function to dynamically load Google Maps API
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
          componentRestrictions: { country: "in" }, // Optional: Restrict to a country
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
  }, []); // Load only once when the component mounts

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

  useEffect(() => {
    const storage = localStorage.getItem("catererData");
    if (catererId === "" && storage) {
      setCatererId(JSON.parse(storage));
    }
  }, [catererId]);
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const catererId = user.catererId;
    setCatererId(catererId);
  }

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prevState) => {
        const isAlreadySelected = prevState.cateringType.includes(value);
        if (!isAlreadySelected) {
          return {
            ...prevState,
            cateringType: [...prevState.cateringType, value],
          };
        }

        return prevState;
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        cateringType: prevState.cateringType.filter((type) => type !== value),
      }));
    }
  };

  const handleChangeLoc = (e) => {
    setServiceLocat({ ...serviceLocat, location: e.target.value });
  };

  const handleChangePin = (e) => {
    setServiceLocat({ ...serviceLocat, PinCode: e.target.value });
  };
  const getUpdatedFields = (formData, initialState) => {
    let updatedFields = {};
    Object.keys(formData).forEach((key) => {
      // If the current formData value is different from the initial value, include it in updatedFields
      if (formData[key] !== "name") {
        if (
          JSON.stringify(formData[key]) !== JSON.stringify(initialState[key])
        ) {
          updatedFields[key] = formData[key];
        }
      }
    });
    return updatedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const typeofcusin = Array.isArray(formData.cuisinesOffered);
    if (!typeofcusin) {
      formData.cuisinesOffered = formData?.cuisinesOffered?.split(",");
    }
    

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const catererid = user.catererId;
      if (!catererid) {
        const response = await axios.post("http://3.6.41.54/api/caterer", {
          ...formData,
        });
        
        setCatererId(response.data.id);
        const userObj = JSON.parse(localStorage.getItem("user"));
        const userId = userObj.id;

        const catererIdSet = await axios.patch(
          `http://3.6.41.54/api/users/${userId}`,
          { catererId: response.data.id }
        );
        localStorage.setItem(
          "user",
          JSON.stringify({ ...catererIdSet.data, catererId: response.data.id })
        );
        localStorage.setItem("catererData", JSON.stringify(response.data.id));
        toastMessage("Caterer registered successfully!");
        setCatererId(response.data.id);
        localStorage.setItem("catererData", JSON.stringify(response.data.id));
        setCurrentStep(2);
      } else {
        const updatedFields = getUpdatedFields(formData, initial);
        const response = await axios.patch(
          `http://3.6.41.54/api/caterer/${catererid}`,
          {
            ...updatedFields
          }
        );
        setCatererId(response.data.id);
        toastMessage("updated");
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const catererid = user.catererId;
        if (catererid) {
          const response = await axios.get(
            `http://3.6.41.54/api/caterer/${catererid}`
          );
          let {
            name,
            gstNo,
            address,
            mobileNo,
            extraInformation,
            maxPrice,
            minPrice,
            cateringType,
            maximumServingCapacity,
            inServiceFrom,
            cuisinesOffered,
            specialistIn,
            googleLocation,
            dishes,
            serviceLocation,
            review,
            status,
          } = response.data;
          inServiceFrom = formatDate(inServiceFrom);
          setInitial(JSON.parse(JSON.stringify({
            name,
            gstNo,
            address,
            mobileNo,
            extraInformation,
            maxPrice,
            minPrice,
            cateringType,
            maximumServingCapacity,
            inServiceFrom,
            cuisinesOffered,
            specialistIn,
            googleLocation,
            dishes,
            serviceLocation,
            review,
            status
          })))

          setFormData((prev) => ({
            ...prev,
            name,
            gstNo,
            address,
            mobileNo,
            extraInformation,
            maxPrice,
            minPrice,
            cateringType,
            inServiceFrom,
            maximumServingCapacity,
            cuisinesOffered,
            specialistIn,
            googleLocation,
            dishes,
            serviceLocation,
            review,
            status
          }));
        }
      } catch (error) {
        console.error("Error fetching caterer data:", error);
      }
    };

    fetchData();
  }, [catererId]);

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
        <label htmlFor="cuisinesOffered">Cuisines Offered</label>
        <input
          type="text"
          id="cuisinesOffered"
          name="cuisinesOffered"
          placeholder="Ex: North Indian, South Indian, Maharashtrian"
          value={formData.cuisinesOffered}
          onChange={handleChange}
        />
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
            onChange={handleCheckboxChange}
            checked={formData?.cateringType?.includes("veg")}
          />{" "}
          <label>Veg</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            value="nonVeg"
            onChange={handleCheckboxChange}
            checked={formData?.cateringType?.includes("nonVeg")}
          />{" "}
          <label>Non Veg</label>
        </div>
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            value="jain"
            onChange={handleCheckboxChange}
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
