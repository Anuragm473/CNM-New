import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./OrderPage.module.css";
import OrderPageDishes from "../../components/OrderPageDishes/OrderPageDishes";
import Card from "../../components/Card/Card";
import CatererInfo from "../../components/CatererInfo/CatererInfo";
import CuisinesOffered from "../../components/CuisinesOffered/CuisinesOffered";
import Reviews from "../../components/Reviews/Reviews";
import CatererSummary from "../../components/CatererSummary/CatererSummary";
import Map from "../../components/Map/Map";
import CatererDetails from "../../components/OrderPageCatererDetails/CatererDetails";
import { CatererContext } from "../../CatererContext";
import Spinner from "../../components/Spinner/Spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const OrderPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setCatererId, catererId } = useContext(CatererContext);
  const {selectedPeopleRange}=useContext(CatererContext)
  const { id } = useParams();

  const [catererData, setCatererData] = useState(null);

  useEffect(() => {
    const fetchCatererData = async () => {
      // try {
      //   const response = await fetch(`http://localhost:3000/api/caterer/${id}`);
      //   const data = await response.json();
      //   setCatererData(data);
      // } catch (error) {
      //   console.error("Error fetching caterer data:", error);
      // }
      try {
        const response = await axiosPrivate.get(
          `http://localhost:3000/api/caterer/${id}`
        );
        if (response.data) {
          setCatererData(response.data);
        } else {
          console.error("API response is empty or not as expected:", response);
        }
      } catch (error) {
        console.error("Error fetching caterer data:", error);
      }
    };

    if (id) {
      fetchCatererData();
    }
    if (catererId == "") {
      setCatererId(id);
    }
  }, [id]);
  if (catererId == "") {
    setCatererId(id);
  }
  localStorage.setItem("catererId", JSON.stringify(id));

  if (!catererData) {
    return <Spinner />;
  }

  const catererName = catererData.name;
  const serviceStartYear = new Date(
    catererData.dishes[0].createdAt
  ).getFullYear();
  let dishes
  switch(selectedPeopleRange){
    case '10-25':
      dishes=catererData.dishesfor10_25;
      break;
    case '25-50':
      dishes=catererData.dishesfor25_50;
      break;
    case '50-100':
      dishes=catererData.dishesfor50_100;
      break;
    case '100+':
      dishes=catererData.dishesforabove100;
      break;
  }
  const catererInfo = catererData.extraInformation;
  const serviceSpecialist = catererData.specialistIn;
  const cuisines = catererData.cuisinesOffered;
  const serviceStartDate = new Date(catererData.inServiceFrom).getFullYear();
  const capacity = catererData.maximumServingCapacity;
  const cateringType = catererData.cateringType.join(", ");
  const serviceLocation = catererData.address;
  const reviews = catererData.review;

  return (
    <div className={styles.orderPage}>
      <CatererDetails />
      <div className={styles.mainSection}>
        <div className={styles.mainSectionLeft}>
          <Card
            catererName={catererName}
            tagline="Flavors that bring people together, crafted with care"
            serviceStartYear={serviceStartYear}
          />
          <OrderPageDishes dishes={dishes} />
          <CatererInfo
            info={catererInfo}
            serviceSpecialist={serviceSpecialist}
          />
          <CuisinesOffered cuisines={cuisines} />
          <Reviews reviews={reviews} />
        </div>
        <div className={styles.mainSectionRight}>
          <CatererSummary
            serviceStartDate={serviceStartDate}
            capacity={capacity}
            cateringType={cateringType}
            serviceLocation={serviceLocation}
          />
          {/* <Map /> */}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
