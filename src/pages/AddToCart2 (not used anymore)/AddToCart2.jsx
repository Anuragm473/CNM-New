import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../../components/SideBar/SideBar";
import DishSelection from "../../components/DishSelection/DishSelection";
import styles from "./AddToCart2.module.css";
import Accordion from "../../components/Accordion/Accordion";
import { useNavigate } from "react-router-dom";

const AddToCart2 = () => {
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
            axiosPrivate.get(`http://localhost:3000/api/menus/${id}`)
          );

          const menusResponses = await Promise.all(menuPromises);

          const menus = menusResponses.map((response) => response.data);
          setMenusData(menus);
          console.log(menus, "menus");

          const categoriesArray = [];

          const transformedStorageObject = dish.items.map((item) => {
            const menu = menus.find((menu) => menu.id === item.id) || {};
            console.log(menu, "menu");
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
        />
        <DishSelection
          dishes={filteredDishes}
          selectedItems={selectedDishes}
          onDishSelect={handleDishSelect}
          storageObject={storageObject}
          selectedCategory={selectedCategory}
        />
        <div className={styles.accordionContainer}>
          <Accordion data={storageObject} />
        </div>
      </div>
      <div className={styles.previewOrderButton}>
        <button
          onClick={() => {
            handlePreview();
          }}
        >
          Preview Order
        </button>
      </div>
    </div>
  );
};

export default AddToCart2;
