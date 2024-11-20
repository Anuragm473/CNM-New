import React, { Suspense } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Spinner from "./components/Spinner/Spinner";
import AuthProvider from "./context/AuthProvider";
import { CatererProvider } from "./CatererContext";

const CreateMenu = React.lazy(() => import("./pages/CreateMenu/CreateMenu"));
const CatererDashboard = React.lazy(() =>
  import("./pages/CatererDashboard/CatererDashboard")
);
const CatererSearch = React.lazy(() =>
  import("./pages/CatererSearch/CatererSearch")
);
const OrderPage = React.lazy(() => import("./pages/OrderPage/OrderPage"));
const HomePage = React.lazy(() => import("./pages/HomePage/HomePage"));
const AddToCart = React.lazy(() => import("./pages/AddToCart/AddToCart"));
const Bill = React.lazy(() => import("./pages/Bill/Bill"));
const MyOrder = React.lazy(() => import("./pages/MyOrders/MyOrder"));
const AppLayout = React.lazy(() => import("./components/AppLayout"));

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Spinner />}>
          <AppLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <HomePage />
            </Suspense>
          ),
        },
        {
          path: "/caterer",
          element: (
            <Suspense fallback={<Spinner />}>
              <CatererSearch />
            </Suspense>
          ),
        },
        {
          path: "/catererDashboard",
          element: (
            <Suspense fallback={<Spinner />}>
              <CatererDashboard />
            </Suspense>
          ),
        },
        {
          path: "/caterer/:id",
          element: (
            
            <Suspense fallback={<Spinner />}>
              <OrderPage />
            </Suspense>
          ),
        },
        {
          path: "/add-to-cart/:dishId",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<Spinner />}>
                <AddToCart />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/bill",
          element: (
            <ProtectedRoute>
              <Suspense fallback={<Spinner />}>
                <Bill />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "/my-orders",
          element: (
            <Suspense fallback={<Spinner />}>
              <MyOrder />
            </Suspense>
          ),
        },
        {
          path: "create-menu",
          element: (
            <Suspense fallback={<Spinner />}>
              <CreateMenu />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <CatererProvider>
        <RouterProvider router={router} />
      </CatererProvider>
    </AuthProvider>
  );
}

export default App;
