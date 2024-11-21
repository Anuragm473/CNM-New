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
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
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
        address,
        message,
        orderDate: new Date().toISOString(),
        deliveryDate: deliveryDate,
        status: {
          id: 0,
        },
      };
      console.log(myorder);

      const response = await axiosPrivate.post(
        "http://localhost:3000/api/orders",
        myorder
      );
      console.log(response, myorder);
      navigate("/my-orders");
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.billContainer}>
      <div className={styles.mainHeading}>
        <h2 style={{margin:'0',marginBottom:'10px'}}>Order Summary</h2>
      </div>
      <div className={styles.mainBill}>
        <div className={styles.billLeft}>
          <div className={styles.leftHeading}>
            <h3 style={{margin:'0',marginBottom:'5px'}}>Dish Details:</h3>
          </div>
          <Accordion data={cartData} />
        </div>
        <div className={styles.billRight}>
          <div className={styles.rightHeading}>
            <h3 style={{marginTop:'10px',marginBottom:'20px'}}>Order Summary:</h3>
            <div className={styles.deliveryDate}>
              <h3 style={{margin:'0',marginBottom:'5px'}}>Event Date</h3>
              <input
                value={deliveryDate}
                style={{margin:'0',marginBottom:'15px'}}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={styles.deliveryDateInput}
                type="date"
                min={today} // Restrict to today or future dates
              />
            </div>
            <div className={styles.address}>
              <h3 style={{margin:'0',marginBottom:'10px'}}>Event Address</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.deliveryAddressInput}
                type="text"
                placeholder="Enter Event Address"
              />
            </div>
            <div className={styles.message}>
              <h3 style={{margin:'0',marginBottom:'10px'}}>Message</h3>
              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setMessage(e.target.value);
                  }
                }}
                className={styles.messaegInput}
                max={250}
                placeholder="Enter Any Special Instructions"
              />
              <p className={styles.characterCount}>
                {message.length}/250 characters
              </p>
            </div>
            <div className={styles.dishQuantity}>
              <h3 style={{margin:'0',marginBottom:'5px'}}>Number Of People:</h3>
              <input
                className={styles.dishQuantityInput}
                type="number"
                value={dishQuantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                min={1}
              />
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
