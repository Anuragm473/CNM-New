// import React, { useState, useRef } from "react";
// import styles from "./Bill.module.css";

// const detailsList = [
//   {
//     name: "Main Course",
//     dishes: ["Mix Veg"],
//   },
//   {
//     name: "Dal",
//     dishes: ["Makhani Dal", "Dal Tadka"],
//   },
//   {
//     name: "Rice",
//     dishes: ["Jeera Rice"],
//   },
//   {
//     name: "Breads",
//     dishes: ["Naan", "Butter Naan", "Garlic Naan"],
//   },
// ];

// const Bill = () => {
//   const [selected, setSelected] = useState(null);
//   const accordionContentRefs = useRef([]);

//   const toggle = (index) => {
//     if (selected === index) {
//       setSelected(null);
//     } else {
//       setSelected(index);
//     }
//   };

//   return (
//     <div className={styles.billContainer}>
//       <div className={styles.mainHeading}>
//         <h2>Order Summary</h2>
//       </div>
//       <div className={styles.mainBill}>
//         <div className={styles.billLeft}>
//           <div className={styles.leftHeading}>
//             <h3>Dish Details:</h3>
//           </div>
//           {detailsList.map((detail, index) => {
//             const isSelected = selected === index;
//             const contentRef = accordionContentRefs.current[index];
//             const contentHeight =
//               isSelected && contentRef ? contentRef.scrollHeight : 0;

//             return (
//               <div
//                 className={styles.detailAccordion}
//                 onClick={() => toggle(index)}
//                 key={index}
//                 style={{
//                   height: isSelected ? `${contentHeight + 110}px` : "90px",
//                   overflow: "hidden",
//                   transition: "height 0.3s ease",
//                 }}
//               >
//                 <div className={styles.accordionHeading}>
//                   <h4>{detail.name}</h4>
//                   <i
//                     className={`fa-solid fa-caret-up ${styles.accordionIcon} ${
//                       isSelected ? "" : styles.flip
//                     }`}
//                   ></i>
//                 </div>
//                 <div
//                   className={styles.accordionContent}
//                   ref={(el) => (accordionContentRefs.current[index] = el)}
//                 >
//                   {detail.dishes.map((dish, index) => (
//                     <p key={index}>{`${index + 1}. ${dish}`}</p>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//         <div className={styles.billRight}>
//           <div className={styles.rightHeading}>
//             <h3>Order Summary:</h3>
//             <div className={styles.deliveryDate}>
//               <h3>Delivery Date</h3>
//               <input className={styles.deliveryDateInput} type="date" />
//             </div>
//             <div className={styles.dishQuantity}>
//               <h3>Dish Quantity:</h3>
//               <input className={styles.dishQuantityInput} type="number" />
//             </div>
//             <div className={styles.totalPrice}>
//               <h3>Total Price: 400</h3>
//             </div>
//             <div className={styles.addAnItem}>
//               <h3>Add An Item Price: 200</h3>
//             </div>
//             <div className={styles.addAnItem}>
//               <h3>Final Dish Price: 200</h3>
//             </div>
//             <div className={styles.addAnItem}>
//               <h3>Final Price: 0</h3>
//             </div>
//             <div className={styles.addAnItem}>
//               <h3>Total: 30</h3>
//             </div>
//             <div className={styles.couponCode}>
//               <input
//                 className={styles.couponCodeInput}
//                 type="text"
//                 placeholder="Coupon Code"
//               />
//               <button className={styles.couponButton}>Apply</button>
//             </div>
//             <button className={styles.placeOrder}>Place Order</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bill;

// Bill.jsx

import React, { useContext, useEffect, useState } from "react";
import Accordion from "../../components/Accordion/Accordion";
import styles from "./Bill.module.css";
import { CatererContext } from "../../CatererContext";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Bill = () => {
  const axiosPrivate = useAxiosPrivate();
  const [cartData, setCartData] = useState([]);
  const [dishDetails, setDishDetails] = useState(null);
  const [dishQuantity, setDishQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { catererId } = useContext(CatererContext);
  const [deliveryDate, setDeliveryDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartData"));
    const storedDishDetails = JSON.parse(localStorage.getItem("dishDetails"));

    if (cart) {
      setCartData(cart);
    }
    if (storedDishDetails) {
      setDishDetails(storedDishDetails);
    }
  }, []);

  useEffect(() => {
    if (dishDetails && cartData.length > 0) {
      const addOnPrice = cartData.reduce(
        (sum, item) => sum + item.price * item.addon,
        0
      );
      const total = dishDetails.price + addOnPrice;
      const finalQuantity =
        dishQuantity === "" ? 1 : parseInt(dishQuantity, 10);
      const discountedTotal = total * finalQuantity * (1 - discount);
      setTotalPrice(discountedTotal);
    }
  }, [dishQuantity, dishDetails, cartData, discount]);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (Number(value) > 0 && Number.isInteger(Number(value)))
    ) {
      setDishQuantity(value);
    }
  };

  const handleQuantityBlur = () => {
    if (dishQuantity === "" || dishQuantity === "0") {
      setDishQuantity(1);
    }
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleCouponBlur = () => {
    if (couponCode === "Caterersnearme@10") {
      setDiscount(0.1);
    } else if (couponCode !== "") {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const handleOrder = async () => {
    try {
      const dish = JSON.parse(localStorage.getItem("dishDetails"));
      const user = JSON.parse(localStorage.getItem("user"));
      const cartItem = cartData.map((item) => ({
        item: item.name,
        quantity: item.quantity,
        menuItem: item.dishes,
      }));
      const cartItems = cartItem.filter((cartItem) => cartItem.quantity !== 0);

      const myorder = {
        catererId: JSON.parse(localStorage.getItem("catererId")),
        dishId: dish?.id || "",
        userId: user?.id || "",
        items: cartItems,
        totalAmount: Number(totalPrice),
        dishQuantity: Number(dishQuantity) || 1,
        paymentStatus: "Accepted",
        orderDate: new Date().toISOString(),
        deliveryDate: deliveryDate,
        status: {
          id: 0,
        },
      };
      console.log(myorder);

      const response = await axiosPrivate.post(
        "http://3.6.41.54/api/orders",
        myorder
      );
      // console.log(response);
      navigate("/my-orders");
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  return (
    <div className={styles.billContainer}>
      <div className={styles.mainHeading}>
        <h2>Order Summary</h2>
      </div>
      <div className={styles.mainBill}>
        <div className={styles.billLeft}>
          <div className={styles.leftHeading}>
            <h3>Dish Details:</h3>
          </div>
          <Accordion data={cartData} />
        </div>
        <div className={styles.billRight}>
          <div className={styles.rightHeading}>
            <h3>Order Summary:</h3>
            <div className={styles.deliveryDate}>
              <h3>Delivery Date</h3>
              <input
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={styles.deliveryDateInput}
                type="date"
              />
            </div>
            <div className={styles.dishQuantity}>
              <h3>Number Of People:</h3>
              <input
                className={styles.dishQuantityInput}
                type="number"
                value={dishQuantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                min={1}
              />
            </div>
            <div className={styles.addAnItem}>
              <h3>Dish Price: {dishDetails?.price || 0}</h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                Add On Item Price:{" "}
                {cartData.reduce(
                  (sum, item) => sum + item.price * item.addon,
                  0
                )}
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                Final Per Dish Price:{" "}
                {dishDetails
                  ? dishDetails.price +
                    cartData.reduce(
                      (sum, item) => sum + item.price * item.addon,
                      0
                    )
                  : 0}
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                Final Price:{" "}
                {dishDetails
                  ? (dishDetails.price +
                      cartData.reduce(
                        (sum, item) => sum + item.price * item.addon,
                        0
                      )) *
                    (dishQuantity || 1)
                  : 0}
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>Total: {totalPrice.toFixed(2)}</h3>
            </div>
            <div className={styles.couponCode}>
              <input
                className={styles.couponCodeInput}
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={handleCouponChange}
                onBlur={handleCouponBlur}
              />
              <button
                className={styles.couponButton}
                onClick={handleCouponBlur}
              >
                Apply
              </button>
            </div>
            <button className={styles.placeOrder} onClick={handleOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
