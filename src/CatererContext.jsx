import { createContext, useState } from "react";

// Create CatererContext
export const CatererContext = createContext();

// Create a Provider component
export const CatererProvider = ({ children }) => {
  const [catererId, setCatererId] = useState("");
  const [isCaterer, setIsCaterer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeopleRange, setSelectedPeopleRange] = useState("10-25");

  return (
    <CatererContext.Provider value={{selectedPeopleRange,setSelectedPeopleRange, catererId, setCatererId, isCaterer, setIsCaterer,isModalOpen,setIsModalOpen }}>
      {children}
    </CatererContext.Provider>
  );
};
