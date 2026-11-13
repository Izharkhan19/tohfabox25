"use client";
import { useEffect, useState } from "react";
import {
  CubeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getOrderStats,
  getProducts,
  getCategories,
  getMonthlySales,
  getAllUser,
} from "../../api-services/apiService";

export default function Dashboard() {
  /* -------------------- STATE -------------------- */
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);

  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  /* -------------------- API CALLS -------------------- */
  const fetchStats = async () => {
    setLoadingStats(true);
    const result = await getOrderStats();
    if (result?.success) {
      setStats(result?.data?.data || {});
    } else {
      setStats(null);
    }
    setLoadingStats(false);
  };

  const fetchUsers = async () => {
    try {
      const result = await getAllUser();
      if (result?.success) {
        const usersList = result?.data?.data || [];
        setTotalCustomersCount(Array.isArray(usersList) ? usersList.length : (result?.data?.total || 0));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const result = await getProducts({ limit: 1000 });
    if (result?.success) {
      setProducts(result?.data?.data || []);
    } else {
      setProducts([]);
    }
    setLoadingProducts(false);
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const result = await getCategories();
    if (result?.success) {
      setCategories(result?.data?.data || []);
    } else {
      setCategories([]);
    }
    setLoadingCategories(false);
  };

  const fetchMonthlySales = async () => {
    setLoadingChart(true);
    const result = await getMonthlySales();
    if (result?.success) {
      setMonthlySales(result?.data?.data || []);
    } else {
      setMonthlySales([]);
    }
    setLoadingChart(false);
  };

  /* -------------------- LOAD DATA -------------------- */
  useEffect(() => {
    (async () => {
      await Promise.resolve();
      fetchStats();
      fetchUsers();
      fetchProducts();
      fetchCategories();
      fetchMonthlySales();
    })();
  }, []);

  /* -------------------- DERIVED VALUES -------------------- */
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalCustomers = totalCustomersCount || stats?.totalCustomers || 0;

  const totalProductsCount = products.length;
  const activeProducts = products.filter((p) => p.isActive !== false).length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div className="pb-2 border-b border-[#e1b382]/20">
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">
          Dashboard Overview
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Real-time metrics, store inventory, and transaction volume.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80 hover:border-[#e1b382]/40 transition">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-stone-500 text-[11px] sm:text-xs font-medium">Total Products</p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#12343b] mt-1">
                {loadingProducts ? "..." : totalProductsCount}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-400 mt-1.5 truncate">
                {activeProducts} active • {lowStockProducts} low stock
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#12343b]/10 text-[#12343b] shrink-0">
              <CubeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80 hover:border-[#e1b382]/40 transition">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-stone-500 text-[11px] sm:text-xs font-medium">Total Orders</p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#12343b] mt-1">
                {loadingStats ? "..." : totalOrders}
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-600 mt-1.5">
                {stats?.pendingOrders || 0} pending processing
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80 hover:border-[#e1b382]/40 transition">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-stone-500 text-[11px] sm:text-xs font-medium">Revenue</p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#12343b] mt-1">
                {loadingStats ? "..." : `₹${(totalRevenue / 1000).toFixed(1)}k`}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-400 mt-1.5 truncate">
                ₹{totalRevenue.toLocaleString()} all-time
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#e1b382]/20 text-[#12343b] shrink-0">
              <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80 hover:border-[#e1b382]/40 transition">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-stone-500 text-[11px] sm:text-xs font-medium">Customers</p>
              <p className="text-xl sm:text-3xl font-serif font-bold text-[#12343b] mt-1">
                {loadingStats ? "..." : totalCustomers}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-400 mt-1.5">
                Registered clients
              </p>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Monthly Sales */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80 overflow-x-auto min-w-0">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#12343b] mb-4">Monthly Sales Overview</h2>

          {loadingChart ? (
            <div className="h-64 sm:h-80 flex items-center justify-center text-stone-400 text-xs sm:text-sm">
              Loading chart...
            </div>
          ) : monthlySales.length === 0 ? (
            <div className="h-64 sm:h-80 flex items-center justify-center text-stone-400 text-xs sm:text-sm">
              No sales data available
            </div>
          ) : (
            <div className="w-full min-w-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlySales}>
                  <XAxis dataKey="month" stroke="#8ba3a8" fontSize={11} />
                  <YAxis stroke="#8ba3a8" fontSize={11} />
                  <Tooltip 
                    formatter={(v) => `₹${v.toLocaleString()}`} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e1b382', backgroundColor: '#ffffff', fontSize: '12px' }}
                  />
                  <Bar dataKey="total" fill="#12343b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-stone-200/80">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#12343b] mb-4">Quick Stats</h2>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2.5 text-xs sm:text-sm">
              <span className="text-stone-500 font-medium">Categories</span>
              <span className="font-serif font-bold text-[#12343b] text-sm sm:text-base">
                {loadingCategories ? "..." : categories.length}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-stone-100 pb-2.5 text-xs sm:text-sm">
              <span className="text-stone-500 font-medium">Pending Orders</span>
              <span className="font-bold text-amber-600 text-sm sm:text-base">
                {stats?.pendingOrders || 0}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-stone-100 pb-2.5 text-xs sm:text-sm">
              <span className="text-stone-500 font-medium">Out of Stock</span>
              <span className="font-bold text-red-600 text-sm sm:text-base">
                {products.filter((p) => p.stock === 0).length}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
              <span className="text-stone-500 font-medium">Avg Order Value</span>
              <span className="font-serif font-bold text-emerald-700 text-sm sm:text-base">
                ₹{totalOrders ? Math.round(totalRevenue / totalOrders) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
