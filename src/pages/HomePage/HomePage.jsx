import React from "react";
import AboutUsSection from "../../components/AboutUsSection/AboutUsSection";
// import Ourspeciality1 from "../../components/OurSpeciality1/OurSpeciality1";
import useAuth from "../../hooks/useAuth";
import CatererDashboard from "../CatererDashboard/CatererDashboard";
import AboutUsNew from "../../components/AboutUsNew/AboutUsNew";
import ArtGallery from "../../components/ArtGallery/ArtGallery";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import WhyCaterernearme from "../../components/WhyCaterernearme/WhyCaterernearme"
import SuccessStories from "../../components/SuccessStories/SuccessStories";

const HomePage = () => {
  const { user } = useAuth();

  console.log(user);

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
      <AboutUsSection />
      {/* <Ourspeciality1 /> */}
      <AboutUsNew />
      
      <SuccessStories />
      
      <WhyCaterernearme />
      
      <ArtGallery />
    </>
  );
};

export default HomePage;
