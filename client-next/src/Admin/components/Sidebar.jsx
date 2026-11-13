"use client";
// import Link from "next/link";

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
//     const { pathname } = usePathname();

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
//                             href={item.path}
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

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingBagIcon,
  QueueListIcon,
  TagIcon,
  InboxIcon,
  TicketIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  MegaphoneIcon
} from "@heroicons/react/24/outline";

const menu = [
  { name: "Dashboard", icon: HomeIcon, path: "/admin" },
  { name: "Clients", icon: QueueListIcon, path: "/admin/clients" },
  { name: "Products", icon: ShoppingBagIcon, path: "/admin/products" },
  { name: "Categories", icon: TagIcon, path: "/admin/categories" },
  { name: "Orders", icon: InboxIcon, path: "/admin/orders" },
  { name: "Transactions", icon: CurrencyDollarIcon, path: "/admin/transactions" },
  { name: "Promo Codes", icon: TicketIcon, path: "/admin/promos" },
  { name: "Custom Requests", icon: ClipboardDocumentListIcon, path: "/admin/custom-requests" },
  { name: "Gallery", icon: PhotoIcon, path: "/admin/gallery" },
  { name: "Announcements", icon: MegaphoneIcon, path: "/admin/announcements" },
];

export default function Sidebar({ onClose }) {
  const { pathname } = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="w-60 sm:w-64 bg-[#0f2c32] text-stone-200 flex flex-col shadow-[4px_0_24px_rgba(15,44,50,0.5)] h-screen overflow-y-auto border-r border-[#12343b]/60">
      {/* Logo */}
      <div className="p-3.5 border-b border-white/10 bg-[#0c2429] relative">
        <div className="flex items-center gap-2.5">
          <img referrerPolicy="no-referrer" src="/logo.png" alt="Artistary Crafts Logo" className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#e1b382]/40 shrink-0" />
          <h1 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#e1b382] truncate">
            Artistary Crafts
          </h1>
        </div>
        <div className="mt-1 text-[10px] font-semibold text-[#8ba3a8] tracking-wider uppercase flex justify-between items-center w-full">
            <span>Admin Portal</span>
            {onClose && (
                <button 
                  onClick={onClose}
                  className="md:hidden p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
            )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2.5 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl group transition-all text-xs font-semibold
                                ${
                                  isActive
                                    ? "bg-[#12343b] text-[#e1b382] border-l-2 border-[#e1b382] shadow-sm"
                                    : "text-stone-300 hover:bg-white/5 hover:text-white"
                                }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition ${
                  isActive
                    ? "text-[#e1b382]"
                    : "text-stone-400 group-hover:text-[#e1b382]"
                }`}
              />
              <span className="truncate">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2.5 border-t border-white/10 bg-[#0c2429]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/15 text-red-400 transition-all text-xs font-semibold"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
