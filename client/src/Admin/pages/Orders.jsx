import { useEffect, useState } from "react";
import {
  EyeIcon,
  InboxIcon,
  ClockIcon,
  Cog6ToothIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../../api-services/apiService";
import useDebounce from "../../hooks/useDebounce";
import { toast } from 'react-toastify';

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  processing: {
    icon: Cog6ToothIcon,
    color: "bg-blue-100 text-blue-800",
    label: "Processing",
  },
  shipped: {
    icon: TruckIcon,
    color: "bg-purple-100 text-purple-800",
    label: "Shipped",
  },
  delivered: {
    icon: CheckCircleIcon,
    color: "bg-green-100 text-green-800",
    label: "Delivered",
  },
  cancelled: {
    icon: XCircleIcon,
    color: "bg-red-100 text-red-800",
    label: "Cancelled",
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const res = await getOrders();
    if (res?.success) {
      setOrders(res?.data?.data || []);
    } else {
      setOrders([]);
      setError("Failed to load orders");
    }
    setLoading(false);
  };

  /* ---------------- FETCH ORDER DETAIL ---------------- */
  const fetchOrderDetail = async (orderId) => {
    if (!orderId) return;

    setLoadingDetail(true);
    const res = await getOrderById(orderId);

    if (res?.success) {
      setSelectedOrder(res?.data?.data);
      setIsStatusModalOpen(true);
    } else {
      toast.error("Failed to load order details");
    }
    setLoadingDetail(false);
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleStatusUpdate = async () => {
    if (!selectedOrder?._id || !newStatus) return;

    setUpdatingStatus(true);
    const res = await updateOrderStatus(selectedOrder._id, {
      status: newStatus,
    });

    if (res?.success) {
      await fetchOrders();
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setIsStatusModalOpen(false);
      setNewStatus("");
    } else {
      toast.error("Failed to update status");
    }
    setUpdatingStatus(false);
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredOrders = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) => {
      const q = debouncedSearch.toLowerCase();
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q)
      );
    });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Track and manage all customer orders
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order ID, name, email..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {["all", ...Object.keys(statusConfig)].map((status) => {
          const config =
            status === "all"
              ? { icon: InboxIcon, label: "Total" }
              : statusConfig[status];
          const Icon = config.icon;

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`p-3 sm:p-5 rounded-xl border-2 transition ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 hover:border-blue-400"
              }`}
            >
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl font-bold">{statusCounts[status]}</div>
              <div className="text-xs sm:text-sm mt-1">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-16 text-gray-500">Loading orders...</div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-red-600">{error}</div>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow border overflow-x-auto w-full">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Total",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg?.icon || ClockIcon;

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-blue-600">
                      {order.orderNumber || `#${order._id.slice(-8)}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${cfg.color}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchOrderDetail(order._id)}
                        className="text-blue-600"
                      >
                        <EyeIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <InboxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          No orders found
        </div>
      )}

      {/* Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border px-4 py-3 rounded-xl mb-4"
            >
              {Object.entries(statusConfig).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1 border py-2 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-70"
              >
                {updatingStatus ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
