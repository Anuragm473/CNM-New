import React, { useContext, useEffect, useState } from "react";
import Accordion from "../../components/Accordion/Accordion";
import styles from "./Bill.module.css";
import { CatererContext } from "../../CatererContext";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { getFromLocalStorage } from "../../../utility";
import { Helmet } from "react-helmet";

const Bill = () => {
  const { selectedPeopleRange, setSelectedPeopleRange } =
    useContext(CatererContext);
  if (!selectedPeopleRange) {
    setSelectedPeopleRange(getFromLocalStorage("numberOfPeople"));
  }
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
  const [jainNumber, setJainNumber] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [showJainInput, setShowJainInput] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(""); // State for time input
  const [timePeriod, setTimePeriod] = useState("AM");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const catererId = getFromLocalStorage("catererId");

  useEffect(() => {
    const storedDishDetails = getFromLocalStorage("dishDetails");
    const cart = getFromLocalStorage(`${storedDishDetails.id}`);

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

  const handleJainNumberChange = (e) => {
    const value = e.target.value;
    if (
      value === "" ||
      (Number(value) > 0 && Number.isInteger(Number(value)))
    ) {
      setJainNumber(value);
    }
  };

  const handleCheckboxChange = () => {
    setShowJainInput((prev) => !prev);
    if (!showJainInput) {
      setJainNumber(0); // Reset the jainNumber when checkbox is unchecked
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
      if (
        Number(dishQuantity) < numberOfPeople.min ||
        Number(dishQuantity) > numberOfPeople.max
      ) {
        toast(
          `Please select number of people between ${numberOfPeople.min} to ${numberOfPeople.max}`
        );
        return;
      } else if (!address) {
        toast(`Please Enter Addreess before proceding further`);
        return;
      } else if (!deliveryTime || !timePeriod) {
        toast(`Please Enter Time`);
        return;
      } else if (Number(jainNumber) > Number(dishQuantity)) {
        toast(`Jain number should be less then total number`);
        return;
      }
      const dish = getFromLocalStorage("dishDetails");
      const user = getFromLocalStorage("user");
      const cartItem = cartData.map((item) => ({
        item: item.name,
        quantity: item.quantity,
        menuItem: item.dishes,
      }));
      const cartItems = cartItem.filter((cartItem) => cartItem.quantity !== 0);

      const myorder = {
        catererId: catererId,
        dishId: dish?.id || "",
        userId: user?.id || "",
        items: cartItems,
        totalAmount: Number(totalPrice),
        dishQuantity: Number(dishQuantity) || 1,
        paymentStatus: "Pending",
        address,
        message,
        jainNumber: Number(jainNumber) || 0,
        orderDate: new Date().toISOString(),
        deliveryDate,
        time: `${deliveryTime} ${timePeriod}`,
        status: {
          id: 0,
        },
      };

      await axiosPrivate.post("https://www.caterersnearme.in/api/orders", myorder);
      const response = await axiosPrivate.get(`/users/caterer/${catererId}`);
      await axiosPrivate.post("/users/send-email", {
        recipient: response.data.email,
        subject: "New Order",
        message: `You have a new order from caterersnearme`,
      });
      await axiosPrivate.post("/users/send-email", {
        recipient: "caterersnearme@gmail.com",
        subject: "New Order",
        message: `A order from is booked for caterer:${response.data.name}`,
      });
      toast("Order Placed Successfully");
      navigate("/my-orders");
    } catch (error) {
      console.error("Order submission failed:", error);
      toast("Something went wrong");
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
    <Helmet>
    <title>Seamless Booking with Caterers Near Me – Review and Proceed</title>
    <meta name="description" content="Place your catering orders effortlessly on CaterersNearMe. Customize menus, provide event details, and book professional catering services in minutes." />
    <meta name="keywords" content="place catering orders, book catering services, event catering booking, customize catering menu, hire caterers, catering order process, online catering orders" />
    </Helmet>
    <div className={styles.billContainer}>
      <div className={styles.line}></div>
      <div className={styles.mainHeading}>
        <h2 className={styles.mainHeader}>Order Summary</h2>
      </div>
      <div className={styles.mainBill}>
        <div className={styles.billRight}>
          <div className={styles.rightHeading}>
            <div className={styles.deliveryDate}>
              <h3 className={styles.head}>Event Date</h3>
              <input
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className={styles.deliveryDateInput}
                type="date"
                min={today}
              />
            </div>
            <div className={styles.deliveryTime}>
              <h3 className={styles.head}>Event Time</h3>
              <div className={styles.eventTime}>
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
            </div>
            <div className={styles.address}>
              <h3 className={styles.head}>Event Address</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.deliveryAddressInput}
                placeholder="Enter Event Address"
              />
            </div>
            <div className={styles.message}>
              <h3 className={styles.head}>Message</h3>
              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setMessage(e.target.value);
                  }
                }}
                className={styles.deliveryAddressInput}
                max={250}
                placeholder="Enter Any Special Instructions"
              />
              <p className={styles.characterCount}>
                {message.length}/250 characters
              </p>
            </div>
            <div className={styles.dishQuantity}>
              <h3 className={styles.head}>Number Of People:</h3>
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
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="jainCheckbox"
                checked={showJainInput}
                onChange={(e) => setShowJainInput(e.target.checked)}
              />
              <label htmlFor="jainCheckbox">Include Jain Food?</label>
            </div>
            {showJainInput && (
              <div className={styles.dishQuantity1}>
                <h3 className={styles.head1}>Number Of People Jain:</h3>
                <input
                  className={styles.dishQuantityInput}
                  type="number"
                  value={jainNumber}
                  onChange={handleJainNumberChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.billLeft}>
          <Accordion data={cartData} />
          <div className={styles.container}>
            <div className={styles.addAnItem}>
              <h3>
                <span>Dish Price:</span>
                <span> {dishDetails?.price || 0}</span>
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                <span>Add On Item Price: </span>
                <span>
                  {cartData.reduce(
                    (sum, item) => sum + item.price * item.addon,
                    0
                  )}
                </span>
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                <span>Final Per Dish Price: </span>
                <span>
                  {dishDetails
                    ? dishDetails.price +
                      cartData.reduce(
                        (sum, item) => sum + item.price * item.addon,
                        0
                      )
                    : 0}
                </span>
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                <span>Final Price: </span>
                <span>
                  {dishDetails
                    ? (dishDetails.price +
                        cartData.reduce(
                          (sum, item) => sum + item.price * item.addon,
                          0
                        )) *
                      (dishQuantity || 1)
                    : 0}
                </span>
              </h3>
            </div>
            <div className={styles.totalPrice}>
              <h3>
                <span>Total:</span>
                <span> {totalPrice.toFixed(2)}</span>
              </h3>
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
          </div>
        </div>
      </div>
      <div className={styles.btn}>
        <button
          className={`${styles.placeOrder} ${styles.couponButton}`}
          onClick={handleOrder}
        >
          Place Order
        </button>
      </div>
    </div>
    </>
  );
};

export default Bill;
