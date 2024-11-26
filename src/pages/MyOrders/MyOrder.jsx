// import React, { useEffect, useState } from "react";
// import styles from "./MyOrder.module.css";
// import menuImage from "../../assets/caterer/myorder.png";
// import Modal from "../../components/Modal/Modal";
// import Accordion from "../../components/Accordion/Accordion";

// const MyOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     let apiUrl = " ";
//     console.log(userData.role.id)

//     if (userData.role.id == 1) {
//       // Admin (role.id === 1): Fetch all orders
//       apiUrl = `https://www.caterersnearme.in/api/orders`;
//     } else if (userData.role.id == 2) {
//       // Caterer (role.id === 2): Fetch orders for that particular caterer
//       apiUrl = `https://www.caterersnearme.in/api/orders?filters=[{"userId":"${userData.id}"}]`;
//     } else if (userData.role.id == 3) {
//       // User (role.id === 3): Fetch orders for that particular user
//       apiUrl = `https://www.caterersnearme.in/api/orders?filters=[{"catererId":"${userData.id}"}]`;
//     }
//     // Log the URL to verify it's correct
//     console.log("API URL:", apiUrl);

//     // Fetch orders from the API
//     fetch(apiUrl)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Fetched Orders:", data); // Log fetched data for debugging
//         setOrders(data.data);
//       })
//       .catch((error) => console.error("Error fetching orders:", error.message));
//   }, []);

//   const openModal = (order) => {
//     setSelectedOrder(order);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedOrder(null);
//   };

//   // Transform the data to fit the Accordion's expected format
//   const formatAccordionData = (items) => {
//     return items.map((item, index) => ({
//       name: item.item,
//       dishes: item.menuItem.map((menu, menuIndex) => `${menu}`),
//     }));
//   };

//   return (
//     <div className={styles.myOrderContainer}>
//       {orders?.map((order) => (
//         <div key={order.id} className={styles.orderCard}>
//           <div className={styles.orderDetails}>
//             <div className={styles.orderUpper}>
//               <div className={styles.orderUpperLeft}>
//                 <img
//                   src={menuImage}
//                   alt="Order"
//                   className={styles.catererImage}
//                 />
//                 <div className={styles.catererDetails}>
//                   <h2 className={styles.catererName}>{order.catererId?.name}</h2>
//                   <p>
//                     Dish Items: {order.items.length} | Order Quantity:{" "}
//                     {order.dishQuantity}
//                   </p>
//                   <div className={styles.paymentStatus}>
//                     <p>Amount: ₹{order.totalAmount}</p>
//                     <p>Payment status: {order.paymentStatus}</p>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 className={styles.viewButton}
//                 onClick={() => openModal(order)}
//               >
//                 View
//               </button>
//             </div>
//             <div className={styles.orderFooter}>
//               <b>
//                 Delivery Date:{" "}
//                 {new Date(order.deliveryDate).toLocaleDateString()}
//               </b>
//               <p>
//                 Order By : {order.userId?.firstName} {order.userId?.lastName} |
//                 Contact No: {order.userId?.phone}
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}

//       {selectedOrder && (
//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//           <h2>Order Details: </h2>

//           <div className={styles.modalUpper}>
//             <div className={styles.OrderSummary}>
//               <h3>Order Summary:</h3>
//               <p>Order Quantity: {selectedOrder.dishQuantity}</p>
//               <p>Amount: ₹{selectedOrder.totalAmount}</p>
//               <p>Payment Status: {selectedOrder.paymentStatus}</p>
//               <p>
//                 Delivery Date:{" "}
//                 {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
//               </p>
//             </div>
//             <div>
//               <h3>Ordered By:</h3>
//               <p>
//                 Order By: {selectedOrder.userId.firstName}{" "}
//                 {selectedOrder.userId.lastName}
//               </p>
//               <p>Contact number: {selectedOrder.userId.phone}</p>
//             </div>
//           </div>

//           <Accordion
//             data={formatAccordionData(selectedOrder.items)}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default MyOrder;

import React, { useEffect, useState } from "react";
import styles from "./MyOrder.module.css";
import menuImage from "../../assets/caterer/myorder.png";
import Modal from "../../components/Modal/Modal";
import Accordion from "../../components/Accordion/Accordion";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages
  const limit = 10000; // Number of orders per page

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let apiUrl = "";
    console.log(userData.role.id);

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

    console.log("API URL:", apiUrl);

    // Fetch orders from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Orders:", data);
        if(userData.role.id==1){
        setOrders(data.data.reverse());
        }
        setOrders(data.data);
        setTotalPages(data.totalPages || 1); // Assuming API returns total pages
      })
      .catch((error) => console.error("Error fetching orders:", error.message));
  }, [page]); // Re-fetch when page changes

  // // Pagination handlers
  // const handleNextPage = () => {
  //   if (page < totalPages) {
  //     setPage((prevPage)=>prevPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage((prevPage)=>prevPage - 1);
  //   }
  // };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Transform the data to fit the Accordion's expected format
  const formatAccordionData = (items) => {
    return items.map((item, index) => ({
      name: item.item,
      dishes: item.menuItem.map((menu, menuIndex) => `${menu}`),
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
                  <h2 className={styles.catererName}>
                    {order.catererId?.name}
                  </h2>
                  <h4 className={styles.catererName}>
                    contact no:{order.catererId?.mobileNo}
                  </h4>
                  <h5 className={styles.catererName}>
                    address:{order.address}
                  </h5>
                  <h5 className={styles.catererName}>
                    message:{order.message}
                  </h5>
                  <p>
                    Dish Items: {order.items.length} | Order Quantity:{" "}
                    {order.dishQuantity}
                  </p>
                  <div className={styles.paymentStatus}>
                    <p>Amount: ₹{order.totalAmount}</p>
                    <p>Payment status: {order.paymentStatus}</p>
                  </div>
                </div>
              </div>
              <button
                className={styles.viewButton}
                onClick={() => openModal(order)}
              >
                View
              </button>
            </div>
            <div className={styles.orderFooter}>
              <b>
                Delivery Date:{" "}
                {new Date(order.deliveryDate).toLocaleDateString()}
              </b>
              <p>
                Order By : {order.userId?.firstName} {order.userId?.lastName} |
                Contact No: {order.userId?.phone}
              </p>
            </div>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Order Details: </h2>

          <div className={styles.modalUpper}>
            <div className={styles.OrderSummary}>
              <h3>Order Summary:</h3>
              <p>Order Quantity: {selectedOrder.dishQuantity}</p>
              <p>Amount: ₹{selectedOrder.totalAmount}</p>
              <p>Payment Status: {selectedOrder.paymentStatus}</p>
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
              <p>Contact number: {selectedOrder.userId.phone}</p>
              <p><span style={{fontWeight:'550'}}>address:</span> {selectedOrder.address}</p>
              <p>message: {selectedOrder.message}</p>
            </div>
          </div>

          <Accordion data={formatAccordionData(selectedOrder.items)} />
        </Modal>
      )}

      {/* <div className={styles.pagination}>
      <button onClick={handlePreviousPage} disabled={page == 1}>
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button onClick={handleNextPage} disabled={page == totalPages}>
        Next
      </button>
    </div> */}
    </div>
  );
};

export default MyOrder;
