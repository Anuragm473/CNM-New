// import React, { useState, useEffect, useContext } from "react";
// import SideBar from "../../components/SideBar/SideBar";
// import DishSelection from "../../components/DishSelection/DishSelection";
// import Accordion from "../../components/Accordion/Accordion";
// import styles from "./AddToCart.module.css";
// import { useNavigate, useParams } from "react-router-dom";
// import {CatererContext} from "../../CatererContext";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// const AddToCart = () => {
//   const axiosPrivate = useAxiosPrivate();
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedDishes, setSelectedDishes] = useState([]);
//   const [allDishes, setAllDishes] = useState([]);
//   const [storageObject, setStorageObject] = useState([]);
//   const [initialState, setInitialState] = useState();
//   const { catererId } = useContext(CatererContext);
//   const { dishId } = useParams();

//   const navigate = useNavigate();

//   const { id } = useParams();

//   useEffect(() => {
//     const fetchMenuData = async () => {
//       try {
//         const menuResponse = await fetch("http://3.6.41.54//api/menus/");
//         const menuData = await menuResponse.json();
//         // console.log(menuData);

//         const categoryNames = menuData.data.map((section) => section.name);
//         setAllDishes(menuData.data);

//         const initialStorageObject = categoryNames.map((category) => ({
//           name: category,
//           dishes: [],
//         }));

//         const dishResponse = await fetch(
//           `http://3.6.41.54/api/caterer/${catererId}`
//         );
//         const dishData = await dishResponse.json();
//         // console.log(dishData);
//         const specificDish = dishData.dishes.find((dish) => dish.id === dishId);
//         // console.log(specificDish);

//         if (specificDish) {
//           const availableCategories = specificDish.items.map(
//             (item) => item.item
//           );
//           // console.log(availableCategories);
//           const finalStorageObject = specificDish.items.map((item) => {
//             const newItem = { ...item, addon: 0, name: item.item, dishes: [] };
//             delete newItem.item;
//             return newItem;
//           });
//           // console.log(finalStorageObject);
//           setInitialState(finalStorageObject);
//           setStorageObject(finalStorageObject);

//           setCategories(availableCategories);
//           if (availableCategories.length > 0) {
//             setSelectedCategory(availableCategories[0]);
//           }
//         }

//         // const menuResponse = await axiosPrivate.get(
//         //   `http://3.6.41.54//api/dishes/${dishId}`
//         // );
//         // const menuData = await menuResponse.data;
//         // console.log(menuData, "menuData");
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchMenuData();
//   }, []);

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);

//     const categoryData = storageObject.find((item) => item.name === category);
//     setSelectedDishes(categoryData ? categoryData.dishes : []);
//   };

//   const handleDishSelect = (dish, isSelected) => {
//     setStorageObject((prevStorageObject) => {
//       return prevStorageObject.map((categoryData) => {
//         if (categoryData.name === selectedCategory) {
//           if (
//             isSelected &&
//             categoryData.dishes.length < categoryData.quantity
//           ) {
//             const updatedDishes = [...categoryData.dishes, dish];
//             return { ...categoryData, dishes: updatedDishes };
//           } else if (!isSelected) {
//             const updatedDishes = categoryData.dishes.filter((d) => d !== dish);
//             return { ...categoryData, dishes: updatedDishes };
//           }
//         }
//         return categoryData;
//       });
//     });
//   };
//   function handlePreview() {
//     const totalQuantity = storageObject.map((item) => {
//       return item.quantity === item.dishes.length ? true : false;
//     });
//     if (totalQuantity.includes(false)) {
//       alert("select the proper number of items");
//     } else {
//       navigate("/bill");
//     }
//   }

//   useEffect(() => {
//     const categoryData = storageObject.find(
//       (item) => item.name === selectedCategory
//     );
//     // console.log(categoryData, "categoryData");
//     setSelectedDishes(categoryData ? categoryData.dishes : []);

//     localStorage.setItem("cartData", JSON.stringify(storageObject));
//   }, [storageObject, selectedCategory]);

//   const filteredDishes =
//     allDishes
//       .find((section) => section.name === selectedCategory)
//       ?.items.map((item) => item.items)
//       .flat() || [];

//   console.log(filteredDishes, "filteredDishes");

//   // console.log(categories, "categories");

//   // console.log(selectedCategory, "selectedCategory");
//   // console.log(selectedDishes, "selectedDishes");
//   // console.log(storageObject, "storageObject");
//   // console.log(initialState, "initialState");

//   // console.log(filteredDishes, "dishes");

//   // console.log(allDishes, "allDishes");

//   return (
//     <div className={styles.addtocartContainer}>
//       <div className={styles.addtocart}>
//         <SideBar
//           categories={categories}
//           selectedCategory={selectedCategory}
//           onCategorySelect={handleCategorySelect}
//           storageObject={storageObject}
//           setStorageObject={setStorageObject}
//           initialState={initialState}
//         />
//         <DishSelection
//           dishes={filteredDishes}
//           selectedItems={selectedDishes}
//           onDishSelect={handleDishSelect}
//           storageObject={storageObject}
//           selectedCategory={selectedCategory}
//         />
//         <div className={styles.accordionContainer}>
//           <Accordion data={storageObject} />
//         </div>
//       </div>
//       <div className={styles.previewOrderButton}>
//         <button
//           onClick={() => {
//             handlePreview();
//           }}
//         >
//           Preview Order
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AddToCart;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../../components/SideBar/SideBar";
import DishSelection from "../../components/DishSelection/DishSelection";
import styles from "./AddToCart.module.css";
import Accordion from "../../components/Accordion/Accordion";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const axiosPrivate = useAxiosPrivate();
  const { dishId } = useParams();
  const [dishData, setDishData] = useState({});
  const [menusData, setMenusData] = useState([]);
  const [storageObject, setStorageObject] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const dishResponse = await axiosPrivate.get(`/dishes/${dishId}`);
        const dish = dishResponse.data;
        setDishData(dish);

        if (dish.items && dish.items.length > 0) {
          const itemIds = dish.items.map((item) => item.id);

          const menuPromises = itemIds.map((id) =>
            axiosPrivate.get(`http://3.6.41.54/api/menus/${id}`)
          );

          const menusResponses = await Promise.all(menuPromises);

          let menus = menusResponses
              .map((response) => response.data)
              .filter((menu) => menu.items[0] !== "-");
          setMenusData(menus);
          console.log(menus, "menus");

          const categoriesArray = [];

          const transformedStorageObject = dish.items.map((item) => {
            const menu = menus.find((menu) => menu.id === item.id) || {};
            let currentDishes = [];
            categoriesArray.push(item.item);

            if (menu.items && menu.items.length > 0) {
              currentDishes = menu.items.flatMap((menuItem) => [
                ...menuItem.items,
              ]);
            }

            const currentDishesObject = {
              name: menu.name,
              dishes: currentDishes,
            };

            // console.log(currentDishesObject, "current dishes object");

            const isDuplicate = allDishes.some(
              (dish) =>
                dish.name === currentDishesObject.name &&
                JSON.stringify(dish.dishes) ===
                  JSON.stringify(currentDishesObject.dishes)
            );

            if (!isDuplicate) {
              setAllDishes((allDishes) => [...allDishes, currentDishesObject]);
            }

            return {
              _id: item.id,
              quantity: item.quantity,
              price: item.price,
              addon: 0,
              name: item.item || "Unknown",
              dishes: [],
            };
          });

          setStorageObject(transformedStorageObject);
          console.log(storageObject, "storage object");
          setCategories(categoriesArray);
          if (categoriesArray.length > 0) {
            setSelectedCategory(categoriesArray[0]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchDishData();
  }, [dishId, axiosPrivate]);

  useEffect(() => {
    const categoryData = storageObject.find(
      (item) => item.name === selectedCategory
    );
    setSelectedDishes(categoryData ? categoryData.dishes : []);

    localStorage.setItem("cartData", JSON.stringify(storageObject));
  }, [storageObject, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);

    const categoryData = storageObject.find((item) => item.name === category);
    setSelectedDishes(categoryData ? categoryData.dishes : []);
  };

  const handleDishSelect = (dish, isSelected) => {
    setStorageObject((prevStorageObject) => {
      return prevStorageObject.map((categoryData) => {
        if (categoryData.name === selectedCategory) {
          if (
            isSelected &&
            categoryData.dishes.length < categoryData.quantity
          ) {
            const updatedDishes = [...categoryData.dishes, dish];
            return { ...categoryData, dishes: updatedDishes };
          } else if (!isSelected) {
            const updatedDishes = categoryData.dishes.filter((d) => d !== dish);
            return { ...categoryData, dishes: updatedDishes };
          }
        }
        return categoryData;
      });
    });
  };

  function handlePreview() {
    const totalQuantity = storageObject.map((item) => {
      return item.quantity === item.dishes.length ? true : false;
    });
    if (totalQuantity.includes(false)) {
      alert("select the proper number of items");
    } else {
      navigate("/bill");
    }
  }

  //   console.log(allDishes, "all dishes");

  const filteredDishes =
    allDishes.find((section) => section.name === selectedCategory)?.dishes ||
    [];

  //   console.log(filteredDishes, "filtered dishes");

  return (
    <div className={styles.addtocartContainer}>
      <div className={styles.addtocart}>
        <SideBar
          categories={categories}
          storageObject={storageObject}
          setStorageObject={setStorageObject}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
          menusData={menusData}
        />
        <DishSelection
          dishes={filteredDishes}
          selectedItems={selectedDishes}
          onDishSelect={handleDishSelect}
          storageObject={storageObject}
          selectedCategory={selectedCategory}
        />
        <div className={styles.accordionContainer}>
          <h3>Preview Your Order</h3>
          <Accordion data={storageObject} />
        </div>
      </div>
      <div className={styles.previewOrderButton}>
        <button
          onClick={() => {
            handlePreview();
          }}
        >
          Place Your Order
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
