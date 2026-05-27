// // import {
// //     CubeIcon,
// //     ShoppingCartIcon,
// //     UserGroupIcon,
// //     ArrowTrendingUpIcon
// // } from "@heroicons/react/24/outline";

// // import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// // const data = [
// //     { name: "Jan", sales: 4000 },
// //     { name: "Feb", sales: 3000 },
// //     { name: "Mar", sales: 5000 },
// //     { name: "Apr", sales: 4500 },
// //     { name: "May", sales: 6000 },
// // ];

// // export default function Dashboard() {
// //     return (
// //         <div className="p-6">
// //             {/* Header */}
// //             <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

// //             {/* Stats Cards */}
// //             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

// //                 {/* Card 1 */}
// //                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
// //                     <div className="flex items-center justify-between">
// //                         <div>
// //                             <p className="text-gray-500 text-sm">Total Products</p>
// //                             <p className="text-3xl font-bold text-gray-800">124</p>
// //                         </div>
// //                         <CubeIcon className="w-14 h-14 text-blue-500 bg-blue-100 p-3 rounded-xl" />
// //                     </div>
// //                 </div>

// //                 {/* Card 2 */}
// //                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
// //                     <div className="flex items-center justify-between">
// //                         <div>
// //                             <p className="text-gray-500 text-sm">Total Orders</p>
// //                             <p className="text-3xl font-bold text-gray-800">89</p>
// //                         </div>
// //                         <ShoppingCartIcon className="w-14 h-14 text-green-500 bg-green-100 p-3 rounded-xl" />
// //                     </div>
// //                 </div>

// //                 {/* Card 3 */}
// //                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
// //                     <div className="flex items-center justify-between">
// //                         <div>
// //                             <p className="text-gray-500 text-sm">Revenue</p>
// //                             <p className="text-3xl font-bold text-gray-800">$24,500</p>
// //                         </div>
// //                         <ArrowTrendingUpIcon className="w-14 h-14 text-purple-500 bg-purple-100 p-3 rounded-xl" />
// //                     </div>
// //                 </div>

// //                 {/* Card 4 */}
// //                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
// //                     <div className="flex items-center justify-between">
// //                         <div>
// //                             <p className="text-gray-500 text-sm">Customers</p>
// //                             <p className="text-3xl font-bold text-gray-800">342</p>
// //                         </div>
// //                         <UserGroupIcon className="w-14 h-14 text-orange-500 bg-orange-100 p-3 rounded-xl" />
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Sales Chart */}
// //             <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
// //                 <h2 className="text-xl font-semibold mb-6 text-gray-800">Sales Overview</h2>
// //                 <ResponsiveContainer width="100%" height={320}>
// //                     <BarChart data={data}>
// //                         <XAxis dataKey="name" stroke="#6B7280" />
// //                         <YAxis stroke="#6B7280" />
// //                         <Tooltip />
// //                         <Bar dataKey="sales" fill="#3B82F6" radius={[6, 6, 0, 0]} />
// //                     </BarChart>
// //                 </ResponsiveContainer>
// //             </div>
// //         </div>
// //     );
// // }

// // src/Admin/pages/Dashboard.jsx
// import { useEffect } from "react";
// import {
//     CubeIcon,
//     ShoppingCartIcon,
//     CurrencyDollarIcon,
//     UserGroupIcon,
// } from "@heroicons/react/24/outline";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer,
// } from "recharts";
// import { useApi } from "../../api-services/hooks/useApi";
// import {
//     getOrderStats,
//     getProducts,
//     getCategories,
//     getMonthlySales,
// } from "../../api-services/apiService";

// export default function Dashboard() {
//     // Fetch real data
//     const {
//         data: stats,
//         loading: loadingStats,
//         request: fetchStats,
//     } = useApi(getOrderStats);

//     const {
//         data: products = [],
//         loading: loadingProducts,
//         request: fetchProducts,
//     } = useApi(getProducts);

//     const {
//         data: categories = [],
//         loading: loadingCategories,
//     } = useApi(getCategories);

//     // Monthly sales data (from backend
//     const {
//         data: monthlySales = [],
//         loading: loadingChart,
//     } = useApi(getMonthlySales) // () => handleApiCall(() => api.get("/orders/stats/monthly")));

//     // Load all data on mount
//     useEffect(() => {
//         fetchStats();
//         fetchProducts();
//     }, []);

//     // Calculate dynamic values
//     const totalRevenue = stats?.totalRevenue || 0;
//     const totalOrders = stats?.totalOrders || 0;
//     const totalCustomers = stats?.totalCustomers || 0;
//     const totalProductsCount = products?.length;
//     const activeProducts = products?.filter(p => p.isActive !== false).length;
//     const lowStockProducts = products?.filter(p => p.stock < 10).length;

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>

//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//                 {/* Total Products */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-gray-500 text-sm">Total Products</p>
//                             <p className="text-3xl font-bold text-gray-800 mt-1">
//                                 {loadingProducts ? (
//                                     <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
//                                 ) : (
//                                     totalProductsCount
//                                 )}
//                             </p>
//                             <p className="text-xs text-gray-500 mt-2">
//                                 {activeProducts} active • {lowStockProducts} low stock
//                             </p>
//                         </div>
//                         <CubeIcon className="w-14 h-14 text-blue-500 bg-blue-100 p-3 rounded-xl" />
//                         {/* <Cube className="w-14 h-14 text-blue-600 bg-blue-100 p-3 rounded-xl" /> */}
//                     </div>
//                 </div>

//                 {/* Total Orders */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-gray-500 text-sm">Total Orders</p>
//                             <p className="text-3xl font-bold text-gray-800 mt-1">
//                                 {loadingStats ? (
//                                     <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
//                                 ) : (
//                                     totalOrders
//                                 )}
//                             </p>
//                             <p className="text-xs text-green-600 mt-2">
//                                 +12% from last month
//                             </p>
//                         </div>
//                         <ShoppingCartIcon className="w-14 h-14 text-green-600 bg-green-100 p-3 rounded-xl" />
//                     </div>
//                 </div>

//                 {/* Revenue */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-gray-500 text-sm">Revenue</p>
//                             <p className="text-3xl font-bold text-gray-800 mt-1">
//                                 {loadingStats ? (
//                                     <span className="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse"></span>
//                                 ) : (
//                                     `₹${(totalRevenue / 1000).toFixed(1)}k`
//                                 )}
//                             </p>
//                             <p className="text-xs text-green-600 mt-2">
//                                 +8% from last month
//                             </p>
//                         </div>
//                         <CurrencyDollarIcon className="w-14 h-14 text-purple-600 bg-purple-100 p-3 rounded-xl" />
//                     </div>
//                 </div>

//                 {/* Customers */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-gray-500 text-sm">Customers</p>
//                             <p className="text-3xl font-bold text-gray-800 mt-1">
//                                 {loadingStats ? (
//                                     <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse"></span>
//                                 ) : (
//                                     totalCustomers
//                                 )}
//                             </p>
//                             <p className="text-xs text-green-600 mt-2">
//                                 +5 new this week
//                             </p>
//                         </div>
//                         <UserGroupIcon className="w-14 h-14 text-orange-600 bg-orange-100 p-3 rounded-xl" />
//                     </div>
//                 </div>
//             </div>

//             {/* Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Sales Overview Chart */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//                     <h2 className="text-xl font-semibold mb-6 text-gray-800">
//                         Monthly Sales Overview
//                     </h2>

//                     {loadingChart ? (
//                         <div className="h-80 flex items-center justify-center">
//                             <div className="text-gray-500">Loading chart...</div>
//                         </div>
//                     ) : !monthlySales && monthlySales?.length === 0 ? (
//                         <div className="h-80 flex items-center justify-center text-gray-500">
//                             No sales data available
//                         </div>
//                     ) : (
//                         <ResponsiveContainer width="100%" height={320}>
//                             <BarChart data={monthlySales || []}>
//                                 <XAxis
//                                     dataKey="month"
//                                     stroke="#6B7280"
//                                     fontSize={12}
//                                     tickLine={false}
//                                 />
//                                 <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
//                                 <Tooltip
//                                     formatter={(value) => `₹${value?.toLocaleString()}`}
//                                     cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
//                                 />
//                                 <Bar
//                                     dataKey="total"
//                                     fill="#3B82F6"
//                                     radius={[8, 8, 0, 0]}
//                                     barSize={40}
//                                 />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     )}
//                 </div>

//                 {/* Recent Activity / Quick Stats */}
//                 <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
//                     <h2 className="text-xl font-semibold mb-6 text-gray-800">
//                         Quick Stats
//                     </h2>

//                     <div className="space-y-5">
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-gray-600">Categories</span>
//                             <span className="font-bold text-lg">
//                                 {loadingCategories ? "..." : categories?.length}
//                             </span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-gray-600">Pending Orders</span>
//                             <span className="font-bold text-lg text-orange-600">
//                                 {stats?.pendingOrders || 0}
//                             </span>
//                         </div>
//                         <div className="flex justify-between items-center pb-4 border-b">
//                             <span className="text-gray-600">Out of Stock</span>
//                             <span className="font-bold text-lg text-red-600">
//                                 {products?.filter(p => p.stock === 0).length}
//                             </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-600">Avg Order Value</span>
//                             <span className="font-bold text-lg text-green-600">
//                                 ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// src/Admin/pages/Dashboard.jsx
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

  const fetchAllUser = async () => {
    setLoadingStats(true);
    const result = await getAllUser();
    if (result?.success) {
      setStats(result?.data?.data || {});
    } else {
      setStats(null);
    }
    setLoadingStats(false);
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const result = await getProducts();
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
    fetchAllUser();
    fetchStats();
    fetchProducts();
    fetchCategories();
    fetchMonthlySales();
  }, []);

  /* -------------------- DERIVED VALUES -------------------- */
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalCustomers = stats?.totalCustomers || 0;

  const totalProductsCount = products.length;
  const activeProducts = products.filter((p) => p.isActive !== false).length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Products */}
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-3xl font-bold">
                {loadingProducts ? "..." : totalProductsCount}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {activeProducts} active • {lowStockProducts} low stock
              </p>
            </div>
            <CubeIcon className="w-14 h-14 text-blue-500 bg-blue-100 p-3 rounded-xl" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">
                {loadingStats ? "..." : totalOrders}
              </p>
            </div>
            <ShoppingCartIcon className="w-14 h-14 text-green-600 bg-green-100 p-3 rounded-xl" />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-3xl font-bold">
                {loadingStats ? "..." : `₹${(totalRevenue / 1000).toFixed(1)}k`}
              </p>
            </div>
            <CurrencyDollarIcon className="w-14 h-14 text-purple-600 bg-purple-100 p-3 rounded-xl" />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl p-6 shadow-md border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Customers</p>
              <p className="text-3xl font-bold">
                {loadingStats ? "..." : totalCustomers}
              </p>
            </div>
            <UserGroupIcon className="w-14 h-14 text-orange-600 bg-orange-100 p-3 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Monthly Sales */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border overflow-x-auto min-w-0">
          <h2 className="text-xl font-semibold mb-6">Monthly Sales Overview</h2>

          {loadingChart ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              Loading chart...
            </div>
          ) : monthlySales.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlySales}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border">
          <h2 className="text-xl font-semibold mb-6">Quick Stats</h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span>Categories</span>
              <span className="font-bold">
                {loadingCategories ? "..." : categories.length}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Pending Orders</span>
              <span className="font-bold text-orange-600">
                {stats?.pendingOrders || 0}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Out of Stock</span>
              <span className="font-bold text-red-600">
                {products.filter((p) => p.stock === 0).length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Avg Order Value</span>
              <span className="font-bold text-green-600">
                ₹{totalOrders ? Math.round(totalRevenue / totalOrders) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
