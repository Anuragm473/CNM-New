import React, { useEffect, useState } from "react";
import styles from "./MyOrder.module.css";
import menuImage from "../../assets/caterer/myorder.png";
import Modal from "../../components/Modal/Modal";
import Accordion from "../../components/Accordion/Accordion";
import { getFromLocalStorage } from "../../../utility";
import { toast } from "react-toastify";
import { axiosPrivate } from "../../api/axios";


const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages
  const limit = 10000; // Number of orders per page
  const userData = getFromLocalStorage("user");

  useEffect(() => {
    let apiUrl = "";
    // Modify the URL based on user role and add pagination parameters (limit, page)
    if (userData.role.id == 1) {
      // Admin (role.id === 1): Fetch all orders
      apiUrl = `https://www.caterersnearme.in/api/orders?limit=${limit}&page=${page}`;
    } else if (userData.role.id == 2) {
      // Caterer (role.id === 2): Fetch orders for that particular caterer
      apiUrl = `https://www.caterersnearme.in/api/orders?filters=[{"userId":"${userData.id}"}]&limit=${limit}&page=${page}`;
    } else if (userData.role.id == 3) {
      // User (role.id === 3): Fetch orders for that particular user
      apiUrl = `https://www.caterersnearme.in/api/orders?filters=[{"catererId":"${userData.catererId}"}]&limit=${limit}&page=${page}`;
    }

    // Fetch orders from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.data.reverse());
        setTotalPages(data.totalPages || 1); // Assuming API returns total pages
      })
      .catch((error) => console.error("Error fetching orders:", error.message));
  }, [page]); // Re-fetch when page changes

  useEffect(() => {
    document.title = 'Hire the Best Caterers Near Me';
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const sendOrderStatusEmail = async (email, status, order) => {
    try {
      await axiosPrivate.post('/users/send-email',{ 
        recipient:email,
        subject:"Order Status",
        message:`Your order has been ${status}`
    })

    await axiosPrivate.post('/users/send-email',{ 
      recipient:'caterersnearme@gmail.com',
      subject:"Order Status",
      message:`The order for user ${order.userId.firstName} has been ${status}`
  })
      toast("Email notification sent successfully!");
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  // Handle Accept/Reject action
  const handleOrderStatusChange = (orderId, status) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, paymentStatus: status } : order
    );
    console.log(updatedOrders)
    setOrders(updatedOrders);

    // Here you would also want to make an API call to update the order status in your backend
    fetch(`https://www.caterersnearme.in/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus: status }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then(() =>{ 
        console.log(`Order ${orderId} status updated to ${status}`)
      if(status!=='Pending'){
        const order = updatedOrders.find((order) => order.id === orderId);
       sendOrderStatusEmail(order.userId.email, status, order)
    }}).catch((error) => console.error('Error updating order status:', error));
  };

  const formatAccordionData = (items) => {
    return items.map((item) => ({
      name: item.item,
      dishes: item.menuItem.map((menu) => `${menu}`),
    }));
  };

  return (
    <div className={styles.myOrderContainer}>
      {orders?.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderDetails}>
            <div className={styles.orderUpper}>
              <div className={styles.orderUpperLeft}>
                <img
                  src={menuImage}
                  alt="Order"
                  className={styles.catererImage}
                />
                <div className={styles.catererDetails}>
                  <h2 className={styles.catererName}>{order.catererId?.name}</h2>
                  <h4 className={styles.catererName}>
                    Event Time: {order.time}
                  </h4>
                  <h5 className={styles.catererName}>
                    Address: {order.address}
                  </h5>
                  <h5 className={styles.catererName}>
                    Message: {order.message}
                  </h5>
                  <p>
                    Dish Items: {order.items.length} | Order Quantity:{" "}
                    {order.dishQuantity}
                  </p>
                  {order.jainNumber && (<p>
                    Order Quantity for jain:{" "}
                    {order.jainNumber}
                  </p>)}
                  <div className={styles.paymentStatus}>
                    <p>Amount: ₹{order.totalAmount}</p>
                    <p>Order Status: {order.paymentStatus}</p>
                  </div>
                </div>
              </div>
              <div>
              <button
                className={styles.viewButton}
                onClick={() => openModal(order)}
              >
                View
              </button>
              {order.paymentStatus === "Pending" && userData.role.id != 2 && (
            <div className={styles.statusButtons}>
              <button
                className={styles.acceptButton}
                onClick={() => handleOrderStatusChange(order.id, "Accepted")}
              >
                Accept
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleOrderStatusChange(order.id, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}
          {order.paymentStatus !== "Pending" && userData.role.id=== "1" && (
            <div className={styles.statusButtons}>
              <button
                className={styles.rejectButton}
                onClick={() => handleOrderStatusChange(order.id, "Pending")}
              >
                Mark Pending
              </button>
            </div>
          )}
          </div>
            </div>
            <div className={styles.orderFooter}>
              <b>
                Delivery Date:{" "}
                {new Date(order.deliveryDate).toLocaleDateString("en-GB")}
              </b>
              <p>
                Order By: {order.userId?.firstName} {order.userId?.lastName}
                {userData.role.id === 1 && ` | ${order?.userId?.phone}`}
              </p>
            </div>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Order Details:</h2>

          <div className={styles.modalUpper}>
            <div className={styles.OrderSummary}>
              <h3>Order Summary:</h3>
              <p>Order Quantity: {selectedOrder.dishQuantity}</p>
              {selectedOrder.jainNumber && (<p>Order Quantity for jain: {selectedOrder.jainNumber}</p>)}
              <p>Amount: ₹{selectedOrder.totalAmount}</p>
              <p>Order Status: {selectedOrder.paymentStatus}</p>
              {userData.role.id === 1 && (
                <p>Caterer Number: {selectedOrder.catererId.mobileNo}</p>
              )}
              <p>
                Delivery Date:{" "}
                {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3>Ordered By:</h3>
              <p>
                Order By: {selectedOrder.userId.firstName}{" "}
                {selectedOrder.userId.lastName}
              </p>
              <p>Event Time: {selectedOrder.time}</p>
              <p>
                <span style={{ fontWeight: "550" }}>Address: </span>
                {selectedOrder.address}
              </p>
              <p>Message: {selectedOrder.message}</p>
              {userData.role.id === 1 && (
                <p>Customer Number: {selectedOrder.userId.phone}</p>
              )}
            </div>
          </div>

          <Accordion data={formatAccordionData(selectedOrder.items)} />
        </Modal>
      )}
    </div>
  );
};

export default MyOrder;
