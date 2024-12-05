import React, { useState, useEffect, useRef, useContext } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import styles from "./CatererSearch.module.css";
import menuImage from "../../assets/caterer/menu1.jpeg";
import axios from "../../api/axios";
import { CatererContext } from "../../CatererContext";

function getCurrentUserLocation() {
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
  const [caterers, setCaterers] = useState([]);
  const [filteredCaterers, setFilteredCaterers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [foodType, setFoodType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [radius, setRadius] = useState(15);
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);
  const mapApiKey = "AIzaSyAUD63maRlEe3fqMDi4ZTrspkP_vVVgcGo";
  const {selectedPeopleRange,setSelectedPeopleRange}=useContext(CatererContext)

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
      { types: ["geocode"] }
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
      handleFilterAndSort();
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
          return caterer.dishesforAbove100?.length > 0;
        default:
          return true;
      }
    });

    setFilteredCaterers(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    
      handleFilterAndSort();
    
  }, [searchQuery, sortOrder, foodType, caterers,isPureVeg]);

  const handleDetailClick = (id) => {
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h5>Find and filter caterers!</h5>
        </div>
        <div className={styles.afterHeader}>
          <div className={styles.searchBar}>
            <input
              id="unified-search-input"
              type="text"
              placeholder="Enter Event's Location"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsAddressSearch(false);
              }}
            />
            {/* <label>Radius(km) </label>
            <input
              type="number"
              placeholder="Radius (km)"
              className={styles.radiusInput}
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            /> */}
            <button className={styles.searchButton} onClick={handleSearch}>
              <i className="fa fa-search" aria-hidden="true"></i> Search
            </button>
          </div>

          <h4>There are {filteredCaterers?.length} caterers for you!</h4>

          <div className={styles.options}>
            <div className={styles.filters}>
              <div className={`${styles.filterItem} ${styles.sortBy}`}>
                <label htmlFor="sort">Sort By: </label>
                <select
                  id="sort"
                  className={styles.filterDropdown}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="rating">Price: Low-High</option>
                  <option value="popularity">Price: High-Low</option>
                </select>
              </div>
              <div className={`${styles.filterItem} ${styles.foodType}`}>
                <label htmlFor="food-type">Cuisine Type: </label>
                <select
                  id="food-type"
                  className={styles.filterDropdown}
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                >
                  <option value="all">All</option>
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
              <div className={`${styles.filterItem} ${styles.foodType}`}>
              <div className={styles.containerToggle}>
                <button
                  onClick={handleToggle}
                  className={`${styles.buttonToggle} ${
                    isPureVeg ? styles.pureVeg : styles.noFilter
                  }`}
                >
                  {isPureVeg ? "Pure Veg" : "No Filter"}
                </button>
              </div>
            </div>
            <div className={styles.filters}>
          <div className={`${styles.filterItem} ${styles.peopleRange}`}>
            <label htmlFor="people-range">Number of People: </label>
            <select
              id="people-range"
              className={styles.filterDropdown}
              value={selectedPeopleRange}
              onChange={(e) => setSelectedPeopleRange(e.target.value)}
            >
              <option value="10-25">10-25</option>
              <option value="25-50">25-50</option>
              <option value="50-100">50-100</option>
              <option value="100+">100+</option>
            </select>
          </div>
        </div>
            </div>
            <div className={styles.resultsCount}>
              Showing {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredCaterers?.length)} of{" "}
              {filteredCaterers?.length} results
            </div>
          </div>

          <div className={styles.catererList}>
            {Array.isArray(currentCaterers) && currentCaterers.length > 0 ? (
              currentCaterers.map((caterer) => (
                <div key={caterer.id} className={styles.catererCard}>
                  <div className={styles.catererDetails}>
                    <div className={styles.catererUpper}>
                      <div className={styles.catererUpperLeft}>
                        <img
                          src={menuImage}
                          alt="Caterer Menu"
                          className={styles.catererImage}
                        />
                        <div className={styles.catererText}>
                          <h3>{caterer.name}</h3>
                          <p>{caterer.address}</p>
                          <p>{caterer.cateringType.join(", ").toUpperCase()}</p>
                        </div>
                      </div>
                      <div className={styles.catererUpperRight}>
                        <button
                          className={styles.detailsButton}
                          onClick={() => handleDetailClick(caterer.id)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                    {caterer.minPrice !== undefined &&
                      caterer.maxPrice !== undefined && (
                        <div className={styles.cardPrice}>
                          <p>
                            <b>Price: </b>
                            <i>
                              ₹{caterer.minPrice} - ₹{caterer.maxPrice}
                            </i>
                          </p>
                        </div>
                      )}
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
