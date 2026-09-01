// import { Link, useLocation } from 'react-router-dom';
// import {
//     HomeIcon,
//     ShoppingBagIcon,
//     TagIcon,
//     InboxIcon,
//     ChartBarIcon,
//     ArrowRightOnRectangleIcon     // ✅ updated icon
// } from '@heroicons/react/24/outline';

// const menu = [
//     { name: 'Dashboard', icon: HomeIcon, path: '/' },
//     { name: 'Products', icon: ShoppingBagIcon, path: '/products' },
//     { name: 'Categories', icon: TagIcon, path: '/categories' },
//     { name: 'Orders', icon: InboxIcon, path: '/orders' },
// ];

// export default function Sidebar() {
//     const { pathname } = useLocation();

//     const handleLogout = () => {
//         localStorage.removeItem('adminToken');
//         window.location.href = '/login';
//     };

//     return (
//         <div className="w-64 bg-gray-900 text-white flex flex-col">
//             <div className="p-6 text-2xl font-bold border-b border-gray-800">
//                 E-Shop Admin
//             </div>

//             <nav className="flex-1 p-4">
//                 {menu.map((item) => {
//                     const Icon = item.icon;
//                     return (
//                         <Link
//                             key={item.name}
//                             to={item.path}
//                             className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition ${pathname === item.path
//                                     ? 'bg-blue-600'
//                                     : 'hover:bg-gray-800'
//                                 }`}
//                         >
//                             <Icon className="w-6 h-6" />
//                             <span>{item.name}</span>
//                         </Link>
//                     );
//                 })}
//             </nav>

//             <button
//                 onClick={handleLogout}
//                 className="p-4 border-t border-gray-800 hover:bg-gray-800 flex items-center space-x-3"
//             >
//                 <ArrowRightOnRectangleIcon className="w-6 h-6" /> {/* ✅ updated */}
//                 <span>Logout</span>
//             </button>
//         </div>
//     );
// }

import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ShoppingBagIcon,
  QueueListIcon,
  TagIcon,
  InboxIcon,
  TicketIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const menu = [
  { name: "Dashboard", icon: HomeIcon, path: "/admin" },
  { name: "Clients", icon: QueueListIcon, path: "/admin/clients" },
  { name: "Products", icon: ShoppingBagIcon, path: "/admin/products" },
  { name: "Categories", icon: TagIcon, path: "/admin/categories" },
  { name: "Orders", icon: InboxIcon, path: "/admin/orders" },
  { name: "Promo Codes", icon: TicketIcon, path: "/admin/promos" },
];

export default function Sidebar({ onClose }) {
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md relative">
        <div className="flex items-center gap-3">
          <img referrerPolicy="no-referrer" src="/logo.png" alt="Tohfabox25 Logo" className="w-12 h-12 rounded-xl object-cover shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300" />
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
            Tohfabox<span className="text-white font-light">25</span>
          </h1>
        </div>
        <div className="mt-2 text-xs font-semibold text-gray-400 tracking-widest uppercase flex justify-between items-center w-full">
            <span>Admin Portal</span>
            {onClose && (
                <button 
                  onClick={onClose}
                  className="md:hidden p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg group transition-all
                                ${
                                  isActive
                                    ? "bg-blue-600 border-l-4 border-blue-300"
                                    : "hover:bg-gray-800 border-l-4 border-transparent"
                                }`}
            >
              <Icon
                className={`w-6 h-6 transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              />
              <span
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600/20 transition-all"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-400" />
          <span className="text-sm font-medium text-red-400">Logout</span>
        </button>
      </div>
    </div>
  );
}
