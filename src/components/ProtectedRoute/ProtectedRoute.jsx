import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CatererContext } from "../../CatererContext";

const ProtectedRoute = ({ children }) => {
  const {setIsModalOpen}=useContext(CatererContext)
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    setIsModalOpen(true)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
