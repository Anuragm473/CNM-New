import React, { useContext, useEffect, useState } from "react";
import styles from "./CreateDish2.module.css";
import axios from "axios";
import { CatererContext } from "../../CatererContext";
import { toastMessage } from "../../../utility";

export default function CreateDish2({ dishes, setPackageData, menuData }) {
  const { catererId } = useContext(CatererContext);
  const [deleted, setDeleted] = useState([]);
  const [packages, setPackages] = useState([]);
  const [catererDish, setCatererDish] = useState([]);
  const [categoryType, setCategoryType] = useState([]); // To store fetched catering types
  const [dishData, setDishData] = useState([]);

  // Fetch menu data based on catererId
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [menuResponse, catererResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/Menus/caterer/${catererId}`),
          axios.get(`http://localhost:3000/api/caterer/${catererId}`),
        ]);

        const menuData = await menuResponse.json();
        setCatererDish(menuData);
        const catererData = catererResponse.data;
        setCategoryType(catererData.cateringType || []);
        setDishData(dishes || []);
        setPackageData((prev) => {
          return {
            ...prev,
            dishesfor25_50: (dishes || []).map((dish) => ({
              ...dish,
              items: dish.items.map((item) => ({
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity),
              })),
            })),
          };
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }
    fetchInitialData();
  }, [catererId]);

  const handlePackageChange = (index, event) => {
    const updatedPackages = [...dishes];
    updatedPackages[index][event.target.name] =
      event.target.name === "price"
        ? Number(event.target.value)
        : event.target.value;
    setPackageData((prev) => {
      return { ...prev, dishesfor25_50: updatedPackages };
    });
  };

  const handleDishChange = (packageIndex, dishIndex, event) => {
    const updatedPackages = [...dishes];
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
    setPackageData((prev) => {
      return { ...prev, dishesfor10_25: updatedPackages };
    });
  };

  const addDish = (packageIndex) => {
    const updatedPackages = [...dishes];
    updatedPackages[packageIndex].items.push({
      id: "",
      item: "",
      price: 0,
      quantity: "",
    });
    setPackageData((prev) => {
      return { ...prev, dishesfor25_50: updatedPackages };
    });
  };

  const removeDish = (packageIndex, dishIndex) => {
    const updatedPackages = [...dishes];
    updatedPackages[packageIndex].items.splice(dishIndex, 1); // Remove the dish
    setPackageData((prev) => {
      return { ...prev, dishesfor25_50: updatedPackages };
    });
  };

  const addPackage = () => {
    setPackageData((prev) => {
      return {
        ...prev,
        dishesfor25_50: [
          ...dishes,
          {
            name: "",
            price: 0,
            dishType: "",
            items: [{ id: "", item: "", price: 0, quantity: "" }],
          },
        ],
      };
    });
  };

  const removePackage = (packageIndex) => {
    const updatedPackages = [...dishes];
    const packageToRemove = updatedPackages[packageIndex];
    if (packageToRemove && packageToRemove.id !== undefined) {
      setDeleted((prev) => [...prev, packageToRemove.id]); // Add the `id` to deleted list
    }
    updatedPackages.splice(packageIndex, 1);
    setPackageData((prev) => {
      return { ...prev, dishesfor25_50: updatedPackages };
    });
  };

  const copyMenuToPackage = (packageIndex) => {
    const updatedPackages = [...dishes];
    const existingItems = updatedPackages[packageIndex].items.map(
      (item) => item.item
    );
    const newMenuItems = menuData
      .filter((menu) => !existingItems.includes(menu.item))
      .map((menu) => ({
        item: menu.item,
        price: menu.price || 0,
        quantity: 1,
      }));

    if (newMenuItems.length > 0) {
      updatedPackages[packageIndex].items.push(...newMenuItems);
      setPackageData((prev) => ({
        ...prev,
        dishesfor10_25: updatedPackages,
      }));
    }
  };

  async function SubmitForm(e) {
    e.preventDefault();

    try {
      if (deleted.length > 0) {
        await Promise.all(
          deleted.map((id) =>
            axios.delete(`http://localhost:3000/api/dishes/${id}`)
          )
        );
      }

      const updateDish = dishes.filter((pkg) => {
        const existingPackage = dishData.find((dish) => dish.id === pkg.id);
        return (
          !existingPackage ||
          JSON.stringify(existingPackage) !== JSON.stringify(pkg)
        );
      });

      const results = await Promise.all(
        updateDish.map(async (pkg) => {
          if (pkg.id) {
            const updatedPackage = await axios.patch(
              `http://localhost:3000/api/dishes/${pkg.id}`,
              {
                items: pkg.items.map((item) => ({
                  ...item,
                  price: Number(item.price),
                  quantity: Number(item.quantity),
                })),
                dishType: pkg.dishType,
                price: Number(pkg.price),
                name: pkg.name,
                catererId,
              }
            );
            return updatedPackage.data;
          } else {
            const newPackage = await axios.post(
              `http://localhost:3000/api/dishes`,
              { ...pkg, catererId }
            );
            return { ...newPackage.data, _id: newPackage.data.id };
          }
        })
      );

      const newdishes = results.filter(
        (result) => !dishData.some((existing) => existing.id === result.id)
      );

      if (newdishes.length > 0) {
        const res = await axios.patch(
          `http://localhost:3000/api/caterer/${catererId}`,
          {
            dishesfor25_50: [
              ...dishData.map((el) => el.id),
              ...newdishes.map((el) => el.id),
            ],
          }
        );
      }

      toastMessage("Packages submitted successfully!");
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
        {dishes.map((pkg, pkgIndex) => (
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
                type="number"
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
            <h4>dishes for 25 to 50 people</h4>
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
                    type="number"
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
                    type="number"
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
                <button
                  type="button"
                  onClick={() => copyMenuToPackage(pkgIndex)}
                  className={`${styles.addButton} ${styles.blueButton}`}
                  disabled={catererDish.every((menu) =>
                    pkg.items.some((item) => item.item === menu.name)
                  )}
                >
                  Copy Menu to Package
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
        <button
          type="button"
          onClick={addPackage}
          className={`${styles.addButton} ${styles.greenButton}`}
        >
          Add Package
        </button>
        <button type="submit" onClick={SubmitForm}>
          Submit Packages
        </button>
      </form>
    </>
  );
}
