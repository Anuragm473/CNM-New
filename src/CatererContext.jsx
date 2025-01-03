import { createContext, useState } from "react";

// Create CatererContext
export const CatererContext = createContext();

// Create a Provider component
export const CatererProvider = ({ children }) => {
  const [catererId, setCatererId] = useState("");
  const [isCaterer, setIsCaterer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeopleRange, setSelectedPeopleRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [caterers, setCaterers] = useState([]);
  const [filteredCaterers, setFilteredCaterers] = useState([]);
  const [radius, setRadius] = useState(15);

  return (
    <CatererContext.Provider value={{radius,setRadius,caterers,setCaterers,filteredCaterers,setFilteredCaterers,isAddressSearch,setIsAddressSearch,searchQuery,setSearchQuery,selectedPeopleRange,setSelectedPeopleRange, catererId, setCatererId, isCaterer, setIsCaterer,isModalOpen,setIsModalOpen }}>
      {children}
    </CatererContext.Provider>
  );
};
