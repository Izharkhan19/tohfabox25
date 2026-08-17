import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBagIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MapPinIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { getMyOrders } from "../../api-services/apiService";

export default function OrderList() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const isLoggedIn = !!localStorage.getItem("token") || !!localStorage.getItem("adminToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchOrders = async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getMyOrders();

            if (result?.success && Array.isArray(result?.data?.data)) {
                setOrders(result?.data?.data);
            } else {
                setOrders([]);
                if (result?.message) setError(result.message);
            }
        } catch (err) {
            setError("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [isLoggedIn]);

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        navigate("/login");
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered": return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case "shipped": return <TruckIcon className="w-5 h-5 text-[#2d545e]" />;
            case "processing": return <ClockIcon className="w-5 h-5 text-[#e1b382]" />;
            case "cancelled": return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered": return "bg-green-50 text-green-700 border-green-100";
            case "shipped": return "bg-[#2d545e]/10 text-[#2d545e] border-[#2d545e]/20";
            case "processing": return "bg-[#e1b382]/10 text-[#c89666] border-[#e1b382]/20";
            case "cancelled": return "bg-red-50 text-red-700 border-red-100";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#12343b] mx-auto"></div>
                    <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgba(45,84,94,0.08)] border border-[#c89666]/20">
                    <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-[#12343b] mb-4">Sign In Required</h2>
                    <p className="text-gray-500 mb-8 font-medium">Please sign in to view your account and track your bespoke resin art purchases.</p>
                    <Link
                        to="/login"
                        className="block w-full bg-[#12343b] hover:bg-[#2d545e] text-white font-bold h-14 leading-[56px] rounded-2xl tracking-widest uppercase text-sm transition-all shadow-md"
                    >
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf9] min-h-screen pb-32">
            {/* Account Header Section */}
            <div className="bg-[#12343b] pt-8 pb-12 rounded-b-[40px] shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?w=1920&fit=crop')] opacity-5 object-cover mix-blend-overlay" />
                <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-[#e1b382] rounded-full flex items-center justify-center shadow-inner border-4 border-white/10">
                        <UserCircleIcon className="w-16 h-16 md:w-20 md:h-20 text-[#12343b]" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-4xl font-black text-white font-serif mb-2">
                            {user.name || "Client User"}
                        </h1>
                        <p className="text-[#fdfbf9]/70 font-medium text-lg mb-4">
                            {user.email || "user@example.com"}
                        </p>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-red-500/80 text-white px-6 py-2 rounded-xl text-sm font-bold tracking-wide transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 -mt-6 relative z-20">
                {error ? (
                    <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
                        <ShoppingBagIcon className="w-12 h-12 text-red-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif text-gray-800 mb-2">Oops!</h2>
                        <p className="text-gray-500 mb-6">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="bg-[#12343b] hover:bg-[#2d545e] text-white font-bold px-8 py-3 rounded-full tracking-widest uppercase text-sm transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : !orders || orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-[0_4px_20px_rgba(45,84,94,0.05)] border border-[#c89666]/20">
                        <div className="bg-gray-50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-inner">
                            <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-black text-[#12343b] font-serif mb-3">No Orders Yet</h2>
                        <p className="text-gray-500 font-medium mb-8">Commission or collect your first masterpiece to see it here.</p>
                        <Link
                            to="/products"
                            className="inline-block bg-[#e1b382] hover:bg-[#c89666] text-[#12343b] font-black h-12 px-8 leading-[48px] rounded-xl tracking-widest uppercase text-sm transition-all shadow-md active:scale-95"
                        >
                            Explore Gallery
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl md:text-3xl font-black text-[#12343b] font-serif mb-6 flex items-center gap-3">
                            Order History
                            <span className="bg-[#e1b382] text-[#12343b] text-xs px-3 py-1 rounded-full font-black tracking-widest shadow-sm">
                                {orders.length}
                            </span>
                        </h2>

                        <div className="space-y-5">
                            {orders.map((order) => {
                                const id = order._id || order.id;
                                const items = Array.isArray(order.items) ? order.items : [];
                                const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
                                const isExpanded = expandedOrder === id;

                                return (
                                    <div
                                        key={id}
                                        className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(45,84,94,0.05)] border border-[#c89666]/20 overflow-hidden transition-all hover:shadow-[0_10px_30px_rgba(45,84,94,0.1)]"
                                    >
                                        <div
                                            onClick={() => toggleExpand(id)}
                                            className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer gap-4"
                                        >
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="hidden sm:flex w-14 h-14 bg-[#2d545e]/5 rounded-2xl border border-[#2d545e]/10 items-center justify-center flex-shrink-0">
                                                    <ShoppingBagIcon className="w-6 h-6 text-[#12343b]" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
                                                        <h3 className="text-lg font-black text-[#12343b]">
                                                            {order.orderNumber || `ORD-${id.slice(-8).toUpperCase()}`}
                                                        </h3>
                                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest rounded-full font-black border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status ? order.status : "Pending"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                        <span className="mx-2 text-gray-300">•</span>
                                                        {totalItems} {totalItems === 1 ? "item" : "items"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between w-full sm:w-auto sm:text-right gap-4">
                                                <div>
                                                    <p className="text-xl font-black text-[#12343b]">
                                                        ₹{Number(order.total || 0).toFixed(2)}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-widest font-bold mt-0.5 text-gray-400">
                                                        {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
                                                    {isExpanded ? (
                                                        <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                                                    ) : (
                                                        <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="border-t border-gray-100 p-5 sm:p-6 bg-gray-50/50">
                                                {/* Stepper tracking component */}
                                                {(() => {
                                                    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
                                                    const getStepIndex = (s) => {
                                                        switch (s?.toLowerCase()) {
                                                            case "pending": return 0;
                                                            case "processing": return 1;
                                                            case "shipped": return 2;
                                                            case "delivered": return 3;
                                                            case "cancelled": return -1;
                                                            default: return 0;
                                                        }
                                                    };
                                                    const currentStep = getStepIndex(order.status);

                                                    if (currentStep === -1) {
                                                        return (
                                                            <div className="flex items-center justify-center py-6 mb-8 bg-white border border-red-100 rounded-3xl shadow-sm">
                                                                <div className="text-red-500 px-6 py-2 rounded-full font-black tracking-widest text-sm flex items-center gap-2">
                                                                    <XCircleIcon className="w-6 h-6" />
                                                                    Order Cancelled
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div className="py-6 mb-10 px-4 sm:px-10">
                                                            <div className="relative max-w-2xl mx-auto">
                                                                {/* Background line */}
                                                                <div className="absolute left-4 right-4 top-5 transform -translate-y-1/2 h-1 bg-gray-200 z-0 rounded-full hidden sm:block"></div>
                                                                {/* Active line */}
                                                                <div 
                                                                    className="absolute left-4 top-5 transform -translate-y-1/2 h-1 bg-green-500 z-0 rounded-full transition-all duration-500 hidden sm:block" 
                                                                    style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 32px)` }}
                                                                ></div>
                                                                
                                                                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0 relative z-10">
                                                                    {steps.map((step, index) => {
                                                                        const isCompleted = index <= currentStep;
                                                                        const isCurrent = index === currentStep;
                                                                        
                                                                        return (
                                                                            <div key={step} className="flex sm:flex-col items-center gap-4 sm:gap-2">
                                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-[3px] bg-white transition-all duration-300 flex-shrink-0 ${isCompleted ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-green-500' : 'border-gray-200 text-gray-300'}`}>
                                                                                    {isCompleted ? (
                                                                                        <CheckCircleIcon className="w-6 h-6" />
                                                                                    ) : (
                                                                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                                                                                    )}
                                                                                </div>
                                                                                <div className={`text-sm font-black uppercase tracking-wider ${isCompleted ? 'text-gray-800' : 'text-gray-400'} ${isCurrent ? 'text-green-600' : ''}`}>
                                                                                    {step}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="text-xs uppercase tracking-widest font-black text-gray-500 mb-4 border-b border-gray-200 pb-2">
                                                            Items Ordered
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {items.map((item) => (
                                                                <div key={item._id || Math.random()} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                                                    <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                                        <img
                                                                            src={item.image || "/logo.png"}
                                                                            alt={item.name || "Product"}
                                                                            onError={(e) => {
                                                                                e.currentTarget.onerror = null;
                                                                                e.currentTarget.src = '/logo.png';
                                                                            }}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center">
                                                                        <p className="font-bold text-[#12343b] text-sm line-clamp-1">{item.name || "Unknown Product"}</p>
                                                                        <div className="flex justify-between items-center mt-1">
                                                                            <p className="text-xs font-medium text-gray-500">Qty: {item.quantity || 1}</p>
                                                                            <p className="font-black text-[#12343b] text-sm">
                                                                                ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs uppercase tracking-widest font-black text-gray-500 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                                                            <MapPinIcon className="w-4 h-4" />
                                                            Shipping Details
                                                        </h4>
                                                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-sm">
                                                            <p className="font-black text-[#12343b] mb-1 text-base">
                                                                {order.shippingAddress?.fullName || "Name not available"}
                                                            </p>
                                                            <p className="text-gray-600 font-medium leading-relaxed">
                                                                {order.shippingAddress?.street || ""}
                                                                {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}<br />
                                                                {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                                                                {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                                                                {order.shippingAddress?.country || "United States"}
                                                            </p>
                                                            <p className="text-gray-500 font-medium mt-3 pt-3 border-t border-gray-100">
                                                                Phone: {order.shippingAddress?.phone || "Not provided"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}