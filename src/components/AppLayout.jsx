import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer1 from "./Footer1/Footer1"
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  return (
    <main>
      <ToastContainer />
      <Header />
      <Outlet />
      <Footer1 />
    </main>
  );
}
