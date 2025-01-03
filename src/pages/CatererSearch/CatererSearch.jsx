import React, { useState, useEffect, useRef, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import styles from "./CatererSearch.module.css";
// import menuImage from "../../assets/caterer/menu1.jpeg";
import menuImage from "../../assets/images/searchcaterer.jpeg";
import axios from "../../api/axios";
import { CatererContext } from "../../CatererContext";
import { toast } from "react-toastify";
import { saveToLocalStorage } from "../../../utility";
import StarRating from "../../components/startRating/StarRating"
import searchIcon from "../../assets/images/search.svg"
import { Helmet } from "react-helmet";

export function getCurrentUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          reject(new Error(`Unable to retrieve location: ${error.message}`));
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

const CatererSearch = () => {
  const [sortOrder, setSortOrder] = useState("default");
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [foodType, setFoodType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const mapApiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const {radius,setRadius,caterers,setCaterers,filteredCaterers,setFilteredCaterers,selectedPeopleRange,setSelectedPeopleRange,searchQuery,setSearchQuery,isAddressSearch,setIsAddressSearch}=useContext(CatererContext)

  useEffect(() => {
    const fetchCaterers = async () => {
      try {
        const { lat, lng } = await getCurrentUserLocation();

        const response = await axios.get(
          `http://localhost:3000/api/caterer/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );

        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setCaterers(data);
          setFilteredCaterers(data);
        } else {
          console.log("No nearby caterers found, fetching fallback data...");
          fetchFallbackCaterers();
        }
      } catch (error) {
        console.error("Error fetching nearby caterers:", error);
        fetchFallbackCaterers();
      } finally {
        setLoading(false);
      }
    };

    const fetchFallbackCaterers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/caterer"
        );
        const data = response.data.data;
        if (Array.isArray(data)) {
          setCaterers(data);
          setFilteredCaterers(data);
        }
      } catch (error) {
        console.error("Error fetching fallback caterers:", error);
        setError("Unable to fetch caterers.");
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


  const handleToggle = () => {
    setIsPureVeg(!isPureVeg);
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

  const handlePlaceSelect = () => {
    const addressObject = autocompleteRef.current.getPlace();
    const address = addressObject.formatted_address;
    setSearchQuery(address);
    setIsAddressSearch(true);

    const { lat, lng } = addressObject.geometry.location;
    fetchNearbyCaterers(lat(), lng());
  };

  const fetchNearbyCaterers = async (lat, lng) => {
    try {
      const response = await axiosPrivate.get(
        `http://localhost:3000/api/caterer/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
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

  const handleSearch = () => {
    if (isAddressSearch) {
      setIsAddressSearch(true);
    } else {
      handleFilterAndSort();
    }
  };

  const handleFilterAndSort = () => {
    let filtered = [...caterers];
    if (foodType !== "all") {
      filtered = filtered.filter((caterer) =>
        caterer.cuisinesOffered.some(
          (cuisine) => cuisine.toLowerCase() === foodType.toLowerCase()
        )
      );
    }

    if (sortOrder === "rating") {
      filtered.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortOrder === "popularity") {
      filtered.sort((a, b) => b.minPrice - a.minPrice);
    }

    if(isPureVeg){
      filtered=filtered.filter(caterer=>!caterer.cateringType.includes('nonVeg'))
    }

    filtered = filtered.filter((caterer) => {
      switch (selectedPeopleRange) {
        case "10-25":
          return caterer.dishesfor10_25?.length > 0;
        case "25-50":
          return caterer.dishesfor25_50?.length > 0;
        case "50-100":
          return caterer.dishesfor50_100?.length > 0;
        case "100+":
          return caterer.dishesforabove100?.length > 0;
        default:
          return caterer.dishesfor10_25?.length>0;
      }
    });

    setFilteredCaterers(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    
      handleFilterAndSort();
    
  }, [searchQuery, sortOrder, foodType, caterers,isPureVeg,selectedPeopleRange]);

  const handleDetailClick = (id) => {
    if(selectedPeopleRange===""){
      toast('Select Proper number of People to proceed')
      return
    }
    navigate(`/caterer/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCaterers = filteredCaterers?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredCaterers?.length / itemsPerPage);

  return (
    <>
    <Helmet>
    <title>Caterers Near Me: Discover Top-Rated Caterers Near You for Weddings, Parties & Events</title>
    <meta name="description" content="Find the best caterers near you on CaterersNearMe. Browse profiles, compare reviews, and book trusted catering services for any occasion with ease" />
    <meta name="keywords" content="find caterers near me, best catering services, compare caterers, book catering services, event caterers, wedding catering, local caterers, catering reviews" />
    </Helmet>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
        <h3 className={styles.mainheader}>Welcome to Caterersnearme!</h3>
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
        <button onClick={()=>handleSearch()} className={styles.searchButton}>
          <span className={styles.searchIcon}><img src={searchIcon} alt='search icon'/></span>
          <span>SEARCH</span>
        </button>
        </div>
      </div>
        </div>
        <div className={styles.afterHeader}>

          <div className={styles.empty}>There are {filteredCaterers?.length} caterers for you!</div>

          <div className={styles.options}>
            <div className={styles.filters}>
            <div className={`${styles.filterItem} ${styles.foodType}`}>
              <div className={styles.containerToggle}>
                <button
                  onClick={handleToggle}
                  className={`${styles.buttonToggle} ${
                    isPureVeg ?  styles.noFilter:styles.pureVeg
                  }`}
                >
                  {isPureVeg ? "Pure Veg" : "Veg Mode"}
                </button>
              </div>
            </div>
              <div className={`${styles.filterItem} ${styles.sortBy}`}>
                <select
                  id="sort"
                  className={styles.filterDropdown}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">Sort By:</option>
                  <option value="rating">Price: Low-High</option>
                  <option value="popularity">Price: High-Low</option>
                </select>
              </div>
              <div className={`${styles.filterItem} ${styles.foodType}`}>
                <select
                  id="food-type"
                  className={styles.filterDropdown}
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                >
                  <option value="all">Cuisine Type:</option>
                  <option value="North Indian">North Indian</option>
                  <option value="South Indian">South Indian</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Kathiyawadi">Kathiyawadi</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Jain">Jain</option>
                  <option value="Kokani">Kokani</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Maharashtrian">Maharashtrian</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.catererList}>
            {Array.isArray(currentCaterers) && currentCaterers.length > 0 ? (
              currentCaterers.map((caterer) => (
                <div key={caterer.id} className={styles.catererCard}>
                  <div className={styles.catererDetails}>
                      <div className={styles.catererUpperLeft}>
                        <img
                          src={menuImage}
                          alt="Caterer Menu"
                          className={styles.catererImage}
                        />
                        <div className={styles.catererText}>
                          <h3 className={styles.catererName}>{caterer.name}</h3>
                          <p className={styles.catererAddress}>{caterer.address}</p>
                          <p>{caterer.cateringType.join(", ").toUpperCase()}</p>
                          {caterer.minPrice !== undefined &&
                      caterer.maxPrice !== undefined && (
                        <div className={styles.rating}>
                        <div className={styles.cardPrice}>
                          <div className={styles.cardprice}>
                            <b>Price From</b>
                            <i>
                              {caterer.minPrice}-{caterer.maxPrice}
                            </i>
                          </div>
                        </div>
                        <StarRating size={18} defaultRating={caterer.averageRating || 0}/>
                        </div>
                      )}
                      <div className={styles.catererUpperRight}>
                        <button
                          className={styles.detailsButton}
                          onClick={() => handleDetailClick(caterer.id)}
                        >
                          Details
                        </button>
                      </div>
                        </div>
                      </div>
                    </div>
                </div>
              ))
            ) : (
              <p>No caterers found. Try adjusting your search or filters.</p>
            )}
          </div>

          <div className={styles.pagination}>
            <button
              className={`${styles.pageButton} ${styles.arrowButton} ${
                currentPage === 1 ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`${styles.pageButton} ${
                  currentPage === i + 1 ? styles.active : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`${styles.pageButton} ${styles.arrowButton} ${
                currentPage === totalPages ? styles.disabled : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatererSearch;
