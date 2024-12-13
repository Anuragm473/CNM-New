import React, { useContext, useEffect, useState } from "react";
import CreateDish1 from "../CreateDish1/CreateDish1";
import CreateDish2 from "../CreateDish2/CreateDish2";
import CreateDish3 from "../CreateDish3/CreateDish3";
import CreateDish4 from "../CreateDish4/CreateDish4";
import styles from "./ManageCreatedish.module.css";
import { CatererContext } from "../../CatererContext";
import axios from "axios";

export default function ManageCreatedish() {
  const { catererId } = useContext(CatererContext);
  const [menuData, setMenuData] = useState([]);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    async function initialData() {
      try {
        // Fetch menu data
        const menuResponse = await axios.get(
          `https://www.caterersnearme.in/api/Menus/caterer/${catererId}`
        );
        setMenuData(
          menuResponse.data.map((menu) => ({
            id:menu.id,
            item: menu.name,
            price: 0,
            quantity: 1,
          }))
        );

        // Fetch package data
        const catererResponse = await axios.get(
          `https://www.caterersnearme.in/api/caterer/${catererId}`
        );
        const data = catererResponse.data;
        setPackageData({
          dishesfor10_25: data.dishesfor10_25 || [],
          dishesfor25_50: data.dishesfor25_50 || [],
          dishesfor50_100: data.dishesfor50_100 || [],
          dishesforabove100: data.dishesforabove100 || [],
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    }

    initialData();
  }, [catererId]);

  // Handle price change in the menu table
  const handleMenuPriceChange = (index, value) => {
    const updatedMenuData = [...menuData];
    updatedMenuData[index].price = Number(value);
    setMenuData(updatedMenuData);
  };

  return (
    <div>
      <h2>Menu Table</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Menu Name</th>
              <th>Menu Price</th>
            </tr>
          </thead>
          <tbody>
            {menuData.map((menu, index) => (
              <tr key={index}>
                <td>{menu.item}</td>
                <td>
                  <input
                    type="number"
                    value={menu.price}
                    onChange={(e) =>
                      handleMenuPriceChange(index, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {packageData && (
        <div>
          <h2>Package for 10 to 25 people</h2>
          <CreateDish1
            dishes={packageData.dishesfor10_25}
            setPackageData={setPackageData}
            menuData={menuData}
          />
          <h2>Package for 25 to 50 people</h2>
          <CreateDish2
            dishes={packageData.dishesfor25_50}
            setPackageData={setPackageData}
            menuData={menuData}
          />
          <h2>Package for 50 to 100 people</h2>
          <CreateDish3
            dishes={packageData.dishesfor50_100}
            setPackageData={setPackageData}
            menuData={menuData}
          />
          <h2>Package for more than 100 people</h2>
          <CreateDish4
            dishes={packageData.dishesforabove100}
            setPackageData={setPackageData}
            menuData={menuData}
          />
        </div>
      )}
    </div>
  );
}
