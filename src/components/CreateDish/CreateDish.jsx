import React, { useContext, useEffect, useState } from "react";
import styles from "./CreateDish.module.css";
import axios from "axios";
import { CatererContext } from "../../CatererContext";
import { toastMessage } from "../../../utility";

export default function CreateDish() {
  const { catererId } = useContext(CatererContext);
  const [deleted,setDeleted]=useState([])
  const [packages, setPackages] = useState([
    {
      name: "",
      price: 0,
      dishType: "",
      items: [{ id: "", item: "", price: 0, quantity: "" }],
    },
  ]);
  const [catererDish, setCatererDish] = useState([]);
  const [categoryType, setCategoryType] = useState([]); // To store fetched catering types
  const [dishData, setDishData] = useState([]);

  // Fetch menu data based on catererId
  useEffect(() => {
    async function getMenu() {
      try {
        const response = await fetch(
          "http://3.6.41.54/api/Menus?limit=100000"
        );
        const data = await response.json();
        const catererData = data.data.filter(
          (dish) => dish.catererId === catererId
        );
        setCatererDish(catererData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    }
    

    const user = JSON.parse(localStorage.getItem("user"));
    const catererid = user.catererId;
    if (catererid) {
      async function getPreviousData() {
        const caterer = await axios.get(
          `http://3.6.41.54/api/caterer/${catererid}`
        );
        const dishesData = caterer.data.dishes;
        setDishData(JSON.parse(JSON.stringify(dishesData)));
        setPackages((prev) => [
          ...JSON.parse(JSON.stringify(dishesData)),
          ...prev,
        ]);
      }
      getPreviousData();
    }
    getMenu();
  }, [catererId]);

  // Fetch catering types based on catererId
  useEffect(() => {
    async function fetchCateringTypes() {
      try {
        const response = await axios.get(
          `http://3.6.41.54/api/caterer/${catererId}`
        );
        const cateringData = response.data;
        setCategoryType(cateringData.cateringType || []);
      } catch (error) {
        console.error("Error fetching catering types:", error);
      }
    }
    fetchCateringTypes();
  }, [catererId]);

  const handlePackageChange = (index, event) => {
    const updatedPackages = [...packages];
    updatedPackages[index][event.target.name] =
      event.target.name === "price"
        ? Number(event.target.value)
        : event.target.value;
    setPackages(updatedPackages);
  };

  const handleDishChange = (packageIndex, dishIndex, event) => {
    const updatedPackages = [...packages];
    const selectedDish = catererDish.find(
      (dish) => dish.name === event.target.value
    );
    updatedPackages[packageIndex].items[dishIndex][event.target.name] =
      event.target.name === "price"
        ? Number(event.target.value)
        : event.target.value;
    if (event.target.name === "item" && selectedDish) {
      updatedPackages[packageIndex].items[dishIndex].id = selectedDish.id; // Store the dish's ID
    }
    setPackages(updatedPackages);
  };

  const addDish = (packageIndex) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex].items.push({
      id: "",
      item: "",
      price: 0,
      quantity: "",
    });
    setPackages(updatedPackages);
  };

  const removeDish = (packageIndex, dishIndex) => {
    const updatedPackages = [...packages];
    updatedPackages[packageIndex].items.splice(dishIndex, 1); // Remove the dish
    setPackages(updatedPackages);
  };

  const addPackage = () => {
    setPackages([
      ...packages,
      {
        name: "",
        price: 0,
        dishType: "",
        items: [{ id: "", item: "", price: 0, quantity: "" }],
      },
    ]);
  };

  const removePackage = (packageIndex) => {
    const updatedPackages = [...packages];
    
    // Check if the package at `packageIndex` exists and has a defined `id`
    const packageToRemove = updatedPackages[packageIndex];
    if (packageToRemove && packageToRemove.id !== undefined) {
        setDeleted(prev => [...prev, packageToRemove.id]);  // Add the `id` to deleted list
    }

    // Remove the package from `updatedPackages` and update the state
    updatedPackages.splice(packageIndex, 1);
    setPackages(updatedPackages);
};


  async function SubmitForm(e) {
    e.preventDefault();

    try {
      if(deleted.length>0){
        console.log(deleted)
        const response = await Promise.all(
          deleted.map(id => axios.delete(`http://3.6.41.54/api/dishes/${id}`)))
          console.log('menu deleted',response)
          
      }

      const response = await axios.get(`http://3.6.41.54/api/caterer/${catererId}`);
      const caterersDish = response.data;
      let caterer;
  
      if (caterersDish.dishes) {
        caterer = { ...caterersDish, dishes: caterersDish.dishes.map(dish => ({ ...dish, _id: dish.id })) };
      }
  
      // Prepare the updated packages with the catererId
      const updatedPackages = packages.map((pkg) =>
        pkg.catererId === undefined
          ? {
              ...pkg,
              catererId, // Attach the catererId correctly to each package
            }
          : { ...pkg }
      );

      // Filter and create new dish data by comparing with existing dishes
      const updateDish = updatedPackages.filter((pkg) => {
        // Check if the package exists in the initial dishData
        const existingPackage = dishData.find((dish) => dish.id === pkg.id);

        // Only add to updateDish if there's a change between the current package and the existing one
        return (
          !existingPackage || // If package doesn't exist, it's a new package
          JSON.stringify(existingPackage) !== JSON.stringify(pkg) // Check for changes in existing package
        );
      });

      // Process each package, handling POST and PATCH logic
      const results = await Promise.all(
        updateDish.map(async (pkg) => {
          const existingPackage = dishData.find(
            (existing) => existing.id === pkg.id
          );

          // If package exists and has an id, patch it
          if (pkg.id && existingPackage) {
            const updatedPackage = await axios.patch(
              `http://3.6.41.54/api/dishes/${pkg.id}`,
              {
                items: pkg.items.map((item) => ({
                  ...item,
                  price: Number(item.price), // Ensure prices are numbers
                  quantity: Number(item.quantity), // Ensure quantities are numbers
                })),
                dishType: pkg.dishType,
                price: Number(pkg.price),
                name: pkg.name,
                catererId: pkg.catererId,
              }
            );
            return updatedPackage.data; // Return the updated package data
          } else {
            // If no id exists, create a new package (POST)
            const newPackage = await axios.post(
              `http://3.6.41.54/api/dishes`,
              pkg
            );
            return { ...newPackage.data, _id: newPackage.data.id }; // Return the new package with an id
          }
        })
      );

      // Only create newCaterer and send PATCH if new dishes were added via POST
      const newDishes = results.filter(
        (result) => !dishData.some((existing) => existing.id === result.id)
      );

      // If there are new dishes from POST, merge them with existing dishes
      if (newDishes.length > 0) {
        const newCaterer = caterer?.dishes
          ? { dishes: [...caterer.dishes, ...newDishes] } // Merge only new dishes
          : { dishes: [...newDishes] };

        // PATCH request to update the caterer with the new dishes
        await axios.patch(
          `http://3.6.41.54/api/caterer/${catererId}`,
          newCaterer
        );
      }
  
      toastMessage('Packages submitted successfully!');
    } catch (error) {
      console.error("Error submitting form:", error);
      toastMessage(
        "There was an error submitting the packages. Please try again."
      );
    }
  }

  return (
    <>
      <form className={styles.formContainer}>
        {packages.map((pkg, pkgIndex) => (
          <div key={pkgIndex} className={styles.package}>
            <h3>Package {pkgIndex + 1}</h3>
            <div className={styles.inputGroup}>
              <label>Package Name:</label>
              <input
                type="text"
                name="name"
                value={pkg.name}
                onChange={(event) => handlePackageChange(pkgIndex, event)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Package Price:</label>
              <input
                type="text"
                name="price"
                value={pkg.price}
                onChange={(event) => handlePackageChange(pkgIndex, event)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Category:</label>
              <select
                name="dishType"
                value={pkg.dishType}
                onChange={(event) => handlePackageChange(pkgIndex, event)}
              >
                <option value="" disabled>
                  Select type
                </option>
                {categoryType.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <h4>Dishes</h4>
            {pkg.items.map((dish, dishIndex) => (
              <div key={dishIndex} className={styles.dish}>
                <div className={styles.inputGroup}>
                  <label>Menu Dish:</label>
                  <select
                    name="item"
                    value={dish.item}
                    onChange={(event) =>
                      handleDishChange(pkgIndex, dishIndex, event)
                    }
                  >
                    <option value="" disabled>
                      Select a dish
                    </option>
                    {catererDish.map((catererDish) => (
                      <option key={catererDish.id} value={catererDish.name}>
                        {catererDish.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Dish Price:</label>
                  <input
                    type="text"
                    name="price"
                    value={dish.price}
                    onChange={(event) =>
                      handleDishChange(pkgIndex, dishIndex, event)
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Dish Quantity:</label>
                  <input
                    type="text"
                    name="quantity"
                    value={dish.quantity}
                    onChange={(event) =>
                      handleDishChange(pkgIndex, dishIndex, event)
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDish(pkgIndex, dishIndex)}
                  className={`${styles.removeButton} ${styles.redButton}`}
                >
                  Remove Dish
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDish(pkgIndex)}
              className={`${styles.addButton} ${styles.blueButton}`}
            >
              Add Dish
            </button>
            <button
              type="button"
              onClick={() => removePackage(pkgIndex)}
              className={`${styles.removeButton} ${styles.redButton}`}
            >
              Remove Package
            </button>
          </div>
        ))}
        <button type="button" onClick={addPackage} className={styles.addButton}>
          Add Package
        </button>
      </form>
      <button
        type="button"
        onClick={(e) => SubmitForm(e)}
        className={styles.addButton}
      >
        Submit
      </button>
    </>
  );
}
