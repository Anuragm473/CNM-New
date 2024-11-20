import React, { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CatererContext } from "../../CatererContext";

const ProtectedRoute =({ children }) => {
  const {setIsModalOpen}=useContext(CatererContext)
  const user = JSON.parse(localStorage.getItem("user"));
  const catererId=JSON.parse(localStorage.getItem('dishDetails'))
  const id=catererId.catererId

  if (!user) {
    setIsModalOpen(true)
    return <Navigate to={`/caterer/${id}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
