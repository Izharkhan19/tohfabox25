"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AdminSidebar from "./Sidebar";
import { ArrowRightOnRectangleIcon, Bars3Icon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  useEffect(() => {
    if (pathname === "/admin") {
      router.push("/admin", { replace: true });
    }
  }, [pathname, router]);

  // Close mobile menu on route change
  useEffect(() => {
    (async () => {
      await Promise.resolve();
      setMobileMenuOpen(false);
    })();
  }, [pathname]);

  const getPageTitle = () => {
    if (pathname.includes("products")) return "Products";
    if (pathname.includes("categories")) return "Categories";
    if (pathname.includes("orders")) return "Orders";
    if (pathname.includes("clients")) return "Clients";
    if (pathname.includes("promos")) return "Promo Codes";
    if (pathname.includes("custom-requests")) return "Custom Requests";
    if (pathname.includes("transactions")) return "Transactions";
    if (pathname.includes("gallery")) return "Gallery";
    if (pathname.includes("announcements")) return "Offer Banners";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-[#fcfaf7] overflow-hidden relative font-sans text-slate-800">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#0f2c32]/70 z-40 md:hidden backdrop-blur-sm transition-opacity"
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
        <header className="bg-white/95 backdrop-blur-md border-b border-[#e1b382]/25 px-3.5 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center z-10 relative shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#12343b] hover:bg-[#e1b382]/15 active:scale-95 transition rounded-lg"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#12343b] truncate tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => router.push("/")}
              className="text-[#12343b] hover:text-[#0e272d] hover:bg-[#e1b382]/15 border border-[#12343b]/15 flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition text-xs sm:text-sm font-semibold active:scale-95"
              title="View Client Storefront"
            >
              <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89666]" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl transition text-xs sm:text-sm font-semibold active:scale-95"
              title="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
              <ArrowRightOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 bg-[#fcfaf7]">
          {children} 
        </main>
      </div>
    </div>
  );
}
