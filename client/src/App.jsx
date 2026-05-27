// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // === Admin Imports ===
// import AdminLogin from './Admin/pages/Login';
// import AdminDashboard from './Admin/pages/Dashboard';
// import AdminProducts from './Admin/pages/Products';
// import AddEditProduct from './Admin/pages/AddEditProduct';
// import AdminCategories from './Admin/pages/Categories';
// import AdminOrders from './Admin/pages/Orders';
// import AdminLayout from './Admin/components/Layout'; // ← New: Includes Sidebar + Header

// // === Client Imports ===
// import Home from './Client/pages/Home';
// import Products from './Client/pages/Products';
// import ProductDetail from './Client/pages/ProductDetail';
// import Cart from './Client/pages/Cart';
// import Checkout from './Client/pages/Checkout';
// import ClientLayout from './Client/components/Layout';
// import Wishlist from './Client/pages/Wishlist';
// import OrderSuccess from './Client/pages/OrderSuccess';
// import OrderList from './Client/pages/OrderList';

// // === Auth Helper (Simple Token/Role Check) ===
// const isAdminAuthenticated = () => {
//   try {
//     const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     // Optional: Add JWT decode here to check expiration (use jwt-decode lib)
//     return token && user.role === 'admin';
//   } catch {
//     return false;
//   }
// };

// // === Admin Protected Route ===
// function AdminProtected({ children }) {
//   return isAdminAuthenticated() ? children : <Navigate to="/admin/login" replace />;
// }

// // === Client Layout (Header + Footer Wrapper) ===
// // function ClientLayout({ children }) {
// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white shadow-sm border-b sticky top-0 z-10">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
// //           <h1 className="text-2xl font-bold text-gray-900">Handmade Store</h1>
// //           <nav className="flex gap-6 text-sm font-medium">
// //             <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
// //             <a href="/products" className="text-gray-700 hover:text-blue-600">Products</a>
// //             <a href="/cart" className="text-gray-700 hover:text-blue-600">Cart</a>
// //           </nav>
// //         </div>
// //       </header>

// //       {/* Main Content */}
// //       <main className="flex-1">{children}</main>

// //       {/* Footer */}
// //       <footer className="bg-gray-900 text-white py-10">
// //         <div className="max-w-7xl mx-auto px-4 text-center">
// //           <p className="text-lg font-semibold">Handmade Store</p>
// //           <p className="text-sm text-gray-400 mt-2">© 2025 All rights reserved.</p>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// // === Main App ===
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* ==================== ADMIN PORTAL ==================== */}
//         <Route path="/admin/login" element={<AdminLogin />} />

//         {/* Protected Admin Routes (Flat & Clean) */}
//         <Route path="/admin" element={<AdminProtected><AdminLayout /></AdminProtected>}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="products/add" element={<AddEditProduct />} />
//           <Route path="products/edit/:id" element={<AddEditProduct />} />
//           <Route path="categories" element={<AdminCategories />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="*" element={<Navigate to="/admin" replace />} /> {/* Admin 404 */}
//         </Route>

//         {/* ==================== CLIENT PORTAL (Public) ==================== */}
//         <Route path="/" element={<ClientLayout />}>
//           <Route index element={<Home />} />
//           <Route path="products" element={<Products />} />
//           <Route path="products/:id" element={<ProductDetail />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="wishlist" element={<Wishlist />} />
//           <Route path="checkout" element={<Checkout />} />
//           <Route path="order-list" element={<OrderList />} />
//           <Route path="order-success" element={<OrderSuccess />} />
//           <Route path="*" element={
//             <div className="min-h-screen flex items-center justify-center text-center">
//               <div>
//                 <h1 className="text-6xl font-bold text-gray-800">404</h1>
//                 <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
//                 <a href="/" className="text-blue-600 hover:underline mt-6 inline-block">← Back to Home</a>
//               </div>
//             </div>
//           } />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// === Admin ===
import AdminLogin from "./Admin/pages/Login";
import AdminDashboard from "./Admin/pages/Dashboard";
import AdminClients from "./Admin/pages/Clients";
import AdminProducts from "./Admin/pages/Products";
import AddEditProduct from "./Admin/pages/AddEditProduct";
import AdminCategories from "./Admin/pages/Categories";
import AdminOrders from "./Admin/pages/Orders";
import AdminLayout from "./Admin/components/Layout";

// === Client ===
import Home from "./Client/pages/Home";
import Products from "./Client/pages/Products";
import ProductDetail from "./Client/pages/ProductDetail";
import Cart from "./Client/pages/Cart";
import Checkout from "./Client/pages/Checkout";
import Wishlist from "./Client/pages/Wishlist";
import OrderList from "./Client/pages/OrderList";
import OrderSuccess from "./Client/pages/OrderSuccess";
import ClientLayout from "./Client/components/Layout";

// === Auth ===
import Login from "./Client/pages/Login"; // Your client login page
import Register from "./Client/pages/Register";

// ==================== AUTH HELPERS ====================

// Check if admin is logged in
const isAdmin = () => {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return token && user.role === "admin";
};

// Check if client user is logged in
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get current logged-in user (for role-based UI)
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

// ==================== PROTECTED ROUTES ====================

// Admin Protected Route
function AdminProtected({ children }) {
  const location = useLocation();
  return isAdmin() ? (
    children
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
}

// Client Auth Required (Cart, Wishlist, Orders, Checkout)
function PrivateRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to login, then return to this page after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Optional: Public route that redirects logged-in users
function PublicOnly({ children }) {
  const authenticated = isAuthenticated();
  return authenticated ? <Navigate to="/" replace /> : children;
}

// ==================== MAIN APP ====================
export default function App() {
  const [user, setUser] = useState(getCurrentUser());

  // Listen to login/logout events
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    // Or use a custom event from your auth context
    window.addEventListener("userChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userChanged", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ==================== ADMIN PORTAL ==================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddEditProduct />} />
          <Route path="products/edit/:id" element={<AddEditProduct />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* ==================== CLIENT AUTH ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== CLIENT PUBLIC + PROTECTED ==================== */}
        <Route path="/" element={<ClientLayout user={user} />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />

          {/* Protected Routes - Require Login */}
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <OrderList />
              </PrivateRoute>
            }
          />
          <Route path="order-success" element={<OrderSuccess />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-2xl text-gray-600 mb-8">Page not found</p>
                  <Link
                    to="/"
                    className="text-amber-600 hover:underline text-lg font-medium"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
