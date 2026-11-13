"use client";
import { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
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
import LogoLoader from '../../components/LogoLoader';

/* ---------------- STATUS CONFIG ---------------- */
const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: "bg-yellow-100 text-yellow-800",
    label: "Pending",
  },
  confirmed: {
    icon: CheckCircleIcon,
    color: "bg-teal-100 text-teal-800",
    label: "Confirmed",
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

const sourceConfig = {
  website: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Website",
  },
  whatsapp: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "WhatsApp",
  },
  instagram: {
    color: "bg-pink-50 text-pink-700 border-pink-200",
    label: "Instagram",
  },
  phone: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Phone",
  },
  other: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    label: "Other",
  },
};

const updatedViaOptions = [
  { label: "Admin Panel", value: "admin" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Other", value: "other" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [updatedVia, setUpdatedVia] = useState("admin");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const res = await getOrders({ limit: 100 });
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
      setNewStatus("");
      setStatusComment("");
      setUpdatedVia(res?.data?.data?.orderSource === "whatsapp" ? "whatsapp" : "admin");
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
      comment: statusComment.trim() || undefined,
      updatedVia,
    });

    if (res?.success) {
      toast.success("Order status updated!");
      await fetchOrders();
      const updated = res?.data?.data;
      setSelectedOrder(updated || ((prev) => ({ ...prev, status: newStatus })));
      setNewStatus("");
      setStatusComment("");
    } else {
      toast.error(res?.message || "Failed to update status");
    }
    setUpdatingStatus(false);
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    (async () => {
      await Promise.resolve();
      fetchOrders();
    })();
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredOrders = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) => sourceFilter === "all" || (o.orderSource || "website") === sourceFilter)
    .filter((o) => {
      const q = debouncedSearch.toLowerCase();
      if (!q) return true;
      return (
        o.orderNumber?.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.guestCustomer?.name?.toLowerCase().includes(q) ||
        o.guestCustomer?.phone?.toLowerCase().includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.toLowerCase().includes(q) ||
        o.orderSource?.toLowerCase().includes(q)
      );
    });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-2 border-b border-[#e1b382]/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">
            Orders Management
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Track, review, and fulfill customer purchases.</p>
        </div>

        {/* Source Filter Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {["all", "website", "whatsapp", "other"].map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                sourceFilter === src
                  ? "bg-[#12343b] text-[#e1b382] border-[#12343b] shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              }`}
            >
              {src === "all" ? "All Sources" : sourceConfig[src]?.label || src}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md w-full relative">
        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search order ID, name, email, phone..."
          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#12343b]/20 focus:border-[#12343b] outline-none shadow-sm bg-white"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
        {["all", ...Object.keys(statusConfig)].map((status) => {
          const config =
            status === "all"
              ? { icon: InboxIcon, label: "Total" }
              : statusConfig[status];
          const Icon = config.icon;
          const isSelected = filter === status;

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`p-2.5 sm:p-3.5 rounded-2xl border transition active:scale-95 text-center ${
                isSelected
                  ? "bg-[#12343b] text-[#e1b382] border-[#12343b] shadow-sm"
                  : "bg-white border-stone-200/80 hover:border-[#e1b382]/60 text-stone-700 shadow-sm"
              }`}
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 ${isSelected ? "text-[#e1b382]" : "text-stone-400"}`} />
              <div className="text-base sm:text-xl font-serif font-bold">{statusCounts[status]}</div>
              <div className="text-[10px] sm:text-xs mt-0.5 truncate">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="py-16"><LogoLoader label="Loading orders..." compact /></div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-red-600">{error}</div>
      )}

      {/* Orders Table */}
      {/* Orders Table & Mobile Cards */}
      {!loading && filteredOrders.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow border overflow-hidden w-full">
            <DataTable 
              value={filteredOrders} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]} 
              tableStyle={{ minWidth: '60rem' }}
              className="p-datatable-sm"
              rowHover
              stripedRows
            >
              <Column field="orderNumber" header="Order ID" body={(rowData) => (
                <span className="font-mono text-blue-600">
                  {rowData.orderNumber || `#${rowData._id.slice(-8)}`}
                </span>
              )} sortable></Column>
              <Column header="Customer" body={(rowData) => {
                const name = rowData.user?.name || rowData.guestCustomer?.name || rowData.shippingAddress?.fullName || "Guest";
                const contact = rowData.user?.email || rowData.guestCustomer?.phone || rowData.shippingAddress?.phone || "";
                return (
                  <div>
                    <div className="font-medium">{name}</div>
                    {contact && <div className="text-sm text-gray-500">{contact}</div>}
                  </div>
                );
              }} sortable sortField="user.name"></Column>
              <Column header="Source" body={(rowData) => {
                const src = rowData.orderSource || "website";
                const sc = sourceConfig[src] || sourceConfig.other;
                return (
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${sc.color}`}>
                    {sc.label}
                  </span>
                );
              }} sortable sortField="orderSource"></Column>
              <Column header="Date" body={(rowData) => new Date(rowData.createdAt).toLocaleDateString()} sortable sortField="createdAt"></Column>
              <Column header="Items" body={(rowData) => rowData.items?.length || 0} sortable sortField="items.length"></Column>
              <Column field="total" header="Total" body={(rowData) => <span className="font-bold">₹{rowData.total.toFixed(2)}</span>} sortable></Column>
              <Column header="Status" body={(rowData) => {
                const cfg = statusConfig[rowData.status] || { icon: ClockIcon, color: "bg-gray-100 text-gray-800", label: "Unknown" };
                const StatusIcon = cfg.icon;
                return (
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-full ${cfg.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {cfg.label}
                  </span>
                );
              }} sortable sortField="status"></Column>
              <Column header="Actions" body={(rowData) => (
                <button
                  onClick={() => fetchOrderDetail(rowData._id)}
                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  title="View Details"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              )}></Column>
            </DataTable>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const cfg = statusConfig[order.status];
              const StatusIcon = cfg?.icon || ClockIcon;

              return (
                <div key={order._id} className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 transition hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-blue-600 text-sm sm:text-base font-semibold">
                      {order.orderNumber || `#${order._id.slice(-8)}`}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${cfg.color}`}
                    >
                      <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 text-sm sm:text-base font-medium leading-tight">
                        {order.user?.name || order.guestCustomer?.name || order.shippingAddress?.fullName || "Guest"}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border ${(sourceConfig[order.orderSource || "website"] || sourceConfig.other).color}`}>
                        {(sourceConfig[order.orderSource || "website"] || sourceConfig.other).label}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {order.user?.email || order.guestCustomer?.phone || order.shippingAddress?.phone}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    <div>
                      <span className="font-medium">Date:</span> <br/>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span> <br/>
                      {order.items?.length || 0}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-gray-100">
                    <div className="font-bold text-base sm:text-lg text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </div>
                    <button
                      onClick={() => fetchOrderDetail(order._id)}
                      className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm transition bg-blue-50 sm:bg-transparent px-2 py-1.5 sm:p-0 rounded-lg sm:rounded-none"
                    >
                      <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> 
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <InboxIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          No orders found
        </div>
      )}

      {/* Status Modal */}
      <Dialog 
        header={`Order Details - ${selectedOrder?.orderNumber || (selectedOrder?._id && `#${selectedOrder._id.slice(-8)}`)}`}
        visible={isStatusModalOpen && !!selectedOrder} 
        onHide={() => setIsStatusModalOpen(false)}
        className="w-[95vw] sm:w-full sm:max-w-xl rounded-2xl shadow-2xl"
        breakpoints={{ '960px': '75vw', '640px': '95vw' }}
      >
        <div className="flex flex-col gap-4 mt-2">
          
          {/* ORDER ITEMS SECTION */}
          {selectedOrder?.items && selectedOrder.items.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-72 overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Ordered Items</h3>
              <div className="flex flex-col gap-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2">{item.name}</h4>
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <span className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</span>
                        <span className="font-bold text-blue-600">₹{item.price?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center px-1">
                 <span className="font-bold text-gray-600">Total Amount</span>
                 <span className="font-bold text-lg text-gray-900">₹{selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* ORDER SOURCE & PAYMENT BADGES */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${(sourceConfig[selectedOrder?.orderSource || "website"] || sourceConfig.other).color}`}>
              Source: {(sourceConfig[selectedOrder?.orderSource || "website"] || sourceConfig.other).label}
            </span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              Payment: {selectedOrder?.paymentMethod || "N/A"} ({selectedOrder?.paymentStatus || "pending"})
            </span>
          </div>

          {/* SHIPPING & CUSTOMER DETAILS */}
          {(selectedOrder?.shippingAddress || selectedOrder?.guestCustomer) && (
             <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
               <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider">Customer & Shipping</h3>
               <p className="text-sm text-gray-700 leading-relaxed">
                 <span className="font-semibold">
                   {selectedOrder.shippingAddress?.fullName || selectedOrder.guestCustomer?.name || selectedOrder.user?.name || "Guest"}
                 </span>
                 {(selectedOrder.shippingAddress?.phone || selectedOrder.guestCustomer?.phone) && (
                   <> ({selectedOrder.shippingAddress?.phone || selectedOrder.guestCustomer?.phone})</>
                 )}
                 {(selectedOrder.shippingAddress?.street || selectedOrder.shippingAddress?.city) && (
                   <>
                     <br />
                     {[selectedOrder.shippingAddress.street, selectedOrder.shippingAddress.city].filter(Boolean).join(", ")}
                     <br />
                     {[selectedOrder.shippingAddress.state, selectedOrder.shippingAddress.country].filter(Boolean).join(", ")}
                     {selectedOrder.shippingAddress.zipCode ? ` - ${selectedOrder.shippingAddress.zipCode}` : ""}
                   </>
                 )}
               </p>
             </div>
          )}

          {/* STATUS HISTORY TIMELINE */}
          {selectedOrder?.statusHistory && selectedOrder.statusHistory.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Status History</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {[...selectedOrder.statusHistory].reverse().map((entry, idx) => {
                  const cfg = statusConfig[entry.status] || { color: "bg-gray-100 text-gray-800", label: entry.status };
                  return (
                    <div key={idx} className="flex items-start justify-between gap-3 bg-white p-2.5 rounded-lg border border-gray-100">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          {entry.updatedVia && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium capitalize">
                              via {entry.updatedVia}
                            </span>
                          )}
                          {entry.updatedBy?.name && (
                            <span className="text-[11px] text-gray-500">
                              by {entry.updatedBy.name}
                            </span>
                          )}
                        </div>
                        {entry.comment && (
                          <p className="text-xs text-gray-600">{entry.comment}</p>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <h3 className="text-sm font-bold text-gray-800 mt-2 uppercase tracking-wider">Update Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Dropdown
              value={newStatus}
              onChange={(e) => setNewStatus(e.value)}
              options={Object.entries(statusConfig).map(([key, c]) => ({ label: c.label, value: key }))}
              className="w-full"
              placeholder={selectedOrder?.status ? statusConfig[selectedOrder.status]?.label : "Select a status"}
            />
            <Dropdown
              value={updatedVia}
              onChange={(e) => setUpdatedVia(e.value)}
              options={updatedViaOptions}
              className="w-full"
              placeholder="Updated via"
            />
          </div>
          <input
            type="text"
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
            placeholder="Optional note (e.g., Confirmed on WhatsApp, Dispatched...)"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              label="Close"
              outlined
              onClick={() => setIsStatusModalOpen(false)}
              className="w-full sm:w-1/2 justify-center py-3"
            />
            <Button
              label={updatingStatus ? "Updating..." : "Update Status"}
              icon={updatingStatus ? "pi pi-spin pi-spinner" : "pi pi-check"}
              disabled={updatingStatus || !newStatus}
              onClick={handleStatusUpdate}
              className="w-full sm:w-1/2 justify-center py-3 bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

