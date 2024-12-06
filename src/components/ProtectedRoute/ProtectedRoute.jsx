import React, { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CatererContext } from "../../CatererContext";
import { getFromLocalStorage } from "../../../utility";

const ProtectedRoute =({ children }) => {
  const {setIsModalOpen}=useContext(CatererContext)
  const user = getFromLocalStorage("user");
  const catererId=getFromLocalStorage('dishDetails')
  const id=catererId.catererId

  if (!user) {
    setIsModalOpen(true)
    return <Navigate to={`/caterer/${id}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
