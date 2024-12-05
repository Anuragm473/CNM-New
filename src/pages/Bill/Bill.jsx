import React, { useContext, useEffect, useState } from "react";
import Accordion from "../../components/Accordion/Accordion";
import styles from "./Bill.module.css";
import { CatererContext } from "../../CatererContext";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const Bill = () => {
  const { selectedPeopleRange } = useContext(CatererContext);
  let numberOfPeople;
  switch (selectedPeopleRange) {
    case "10-25":
      numberOfPeople = {
        min: 10,
        max: 25,
      };
      break;
    case "25-50":
      numberOfPeople = {
        min: 25,
        max: 50,
      };
      break;
    case "50-100":
      numberOfPeople = {
        min: 50,
        max: 100,
      };
      break;
    case "100+":
      numberOfPeople = {
        min: 100,
        max: 3000,
      };
      break;
  }
  const axiosPrivate = useAxiosPrivate();
  const [cartData, setCartData] = useState([]);
  const [dishDetails, setDishDetails] = useState(null);
  const [dishQuantity, setDishQuantity] = useState(numberOfPeople.min);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(""); // State for time input
  const [timePeriod, setTimePeriod] = useState("AM");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedDishDetails = JSON.parse(localStorage.getItem("dishDetails"));
    const cart = JSON.parse(localStorage.getItem(`${storedDishDetails.id}`));

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
      if(dishQuantity<numberOfPeople.min || dishQuantity>numberOfPeople.max){
        toast(`Please select number of people between ${numberOfPeople.min} to ${numberOfPeople.max}`)
        return
      }else if(!address){
        toast(`Please Enter Addreess before proceding further`)
        return
      }else if(!deliveryTime || !timePeriod){
        toast(`Please Enter Time`)
        return
      }
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
        deliveryDate,
        time: `${deliveryTime} ${timePeriod}`,
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
      toast('Order Placed Successfully')
      navigate("/my-orders");
    } catch (error) {
      console.error("Order submission failed:", error);
      toast('Something went wrong')
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.billContainer}>
      <div className={styles.mainHeading}>
        <h2 style={{ margin: "0", marginBottom: "10px" }}>Order Summary</h2>
      </div>
      <div className={styles.mainBill}>
        <div className={styles.billLeft}>
          <div className={styles.leftHeading}>
            <h3 style={{ margin: "0", marginBottom: "5px" }}>Dish Details:</h3>
          </div>
          <Accordion data={cartData} />
        </div>
        <div className={styles.billRight}>
          <div className={styles.rightHeading}>
            <h3 style={{ marginTop: "10px", marginBottom: "20px" }}>
              Order Summary:
            </h3>
            <div className={styles.deliveryDate}>
              <h3 style={{ margin: "0", marginBottom: "5px" }}>Event Date</h3>
              <input
                value={deliveryDate}
                style={{ margin: "0", marginBottom: "15px" }}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={styles.deliveryDateInput}
                type="date"
                min={today}
              />
            </div>
            <div className={styles.deliveryTime}>
              <h3 style={{ margin: "0", marginBottom: "5px" }}>Event Time</h3>
              <input
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className={styles.deliveryTimeInput}
                type="time"
              />
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className={styles.timePeriodSelect}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className={styles.address}>
              <h3 style={{ margin: "0", marginBottom: "10px" }}>
                Event Address
              </h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.deliveryAddressInput}
                placeholder="Enter Event Address"
              />
            </div>
            <div className={styles.message}>
              <h3 style={{ margin: "0", marginBottom: "10px" }}>Message</h3>
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
              <h3 style={{ margin: "0", marginBottom: "5px" }}>
                Number Of People:
              </h3>
              <input
                className={styles.dishQuantityInput}
                type="number"
                value={dishQuantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                min={numberOfPeople.min}
                max={
                  numberOfPeople.max === Infinity
                    ? undefined
                    : numberOfPeople.max
                }
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