import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "./Sidebar";
import { ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile drawer support */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none h-full`}
      >
        <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            >
              <Bars3Icon className="w-7 h-7" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {location.pathname.includes("products")
                ? "Products"
                : location.pathname.includes("categories")
                ? "Categories"
                : location.pathname.includes("orders")
                ? "Orders"
                : location.pathname.includes("clients")
                ? "Clients"
                : "Dashboard"}
            </h2>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-red-50 text-sm font-semibold"
          >
            <span className="hidden sm:inline">Logout</span>
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
