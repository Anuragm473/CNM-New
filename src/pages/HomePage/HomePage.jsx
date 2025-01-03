import React, { useEffect } from "react";
import AboutUsSection from "../../components/AboutUsSection/AboutUsSection";
// import Ourspeciality1 from "../../components/OurSpeciality1/OurSpeciality1";
import useAuth from "../../hooks/useAuth";
import CatererDashboard from "../CatererDashboard/CatererDashboard";
import AboutUsNew from "../../components/AboutUsNew/AboutUsNew";
import ArtGallery from "../../components/ArtGallery/ArtGallery";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import WhyCaterernearme from "../../components/WhyCaterernearme/WhyCaterernearme"
import SuccessStories from "../../components/SuccessStories/SuccessStories";
import ServicesOffers from "../../components/ServicesOffers/ServicesOffers"
import HowtoOrder from "../../components/HowtoOrder/HowtoOrder";
import Howitwork from "../../components/Howitwork/Howitwork";
import TestimonialSection from "../../components/TestimonialSecton/TestimonialSection";
import FoodOffers from "../../components/FoodOffers/FoodOffers";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { user } = useAuth();


  if (user.user) {
    if (user.user.role && user.user.role.id === "3") {
      return <CatererDashboard />;
    }
  }

  if (user.user) {
    if (user.user.role && user.user.role.id === "1") {
      return <AdminDashboard />;
    }
  }

  

  return (
    <>
    <Helmet>
    <title>Caterers Near Me: Find the Best Caterers Near You for Every Occasion</title>
    <meta name="description" content="Find the best caterers near you and across Mumbai. Delicious, affordable catering for weddings, corporate events, birthdays, and festive dinners!" />
    <meta name="keywords" content="caterers near me, caterers in Mumbai, wedding caterers, birthday party catering, corporate catering Mumbai, best caterers in India" />
    </Helmet>
      <AboutUsSection />
      <FoodOffers/>
      {/* <Ourspeciality1 /> */}
      {/* <HowtoOrder/> */}
      {/* <Howitwork/> */}
      {/* <WhyCaterernearme /> */}
      <ServicesOffers/>
      <WhyCaterernearme />
      <AboutUsNew />
    
      {/* <TestimonialSection/> */}
      <SuccessStories />
      
      {/* <ArtGallery /> */}
    </>
  );
};

export default HomePage;
