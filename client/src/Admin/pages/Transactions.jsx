import { useEffect, useState } from "react";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { getOrders } from "../../api-services/apiService";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import LogoLoader from "../../components/LogoLoader";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");

    // Fetching orders that have been successfully paid
    const res = await getOrders({ paymentStatus: "paid" });
    if (res?.success) {
      setTransactions(res?.data?.data || []);
    } else {
      setTransactions([]);
      setError("Failed to load transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const q = debouncedSearch.toLowerCase();
    const orderIdMatch = t.orderNumber?.toLowerCase().includes(q) || t._id.toLowerCase().includes(q);
    const txnIdMatch = t.paymentDetails?.transactionId?.toLowerCase().includes(q);
    const userMatch = t.user?.name?.toLowerCase().includes(q) || t.user?.email?.toLowerCase().includes(q);
    return orderIdMatch || txnIdMatch || userMatch;
  });

  const getPaymentMethodIcon = (method) => {
    if (method === "razorpay" || method === "credit_card" || method === "debit_card") {
      return <CreditCardIcon className="w-5 h-5 text-blue-600" />;
    }
    if (method === "cash_on_delivery") {
      return <BanknotesIcon className="w-5 h-5 text-green-600" />;
    }
    return <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Monitor all successful payments
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md relative">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Txn ID, Order ID, name, email..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-gray-200 bg-white flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
             <CurrencyDollarIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Revenue (Paid)</div>
            <div className="text-2xl font-bold">
              ₹{transactions.reduce((sum, t) => sum + (t.total || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="p-5 rounded-xl border border-gray-200 bg-white flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600">
             <CheckCircleIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Successful Transactions</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="py-16"><LogoLoader label="Loading transactions..." compact /></div>
      )}

      {error && !loading && (
        <div className="text-center py-16 text-red-600">{error}</div>
      )}

      {/* Transactions Table */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="bg-white rounded-2xl shadow border overflow-x-auto w-full">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Transaction ID",
                  "Order ID",
                  "Date",
                  "Customer",
                  "Method",
                  "Amount",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((t) => {
                const txnId = t.paymentDetails?.transactionId || "N/A";
                const date = t.paymentDetails?.paidAt ? new Date(t.paymentDetails.paidAt).toLocaleString() : "N/A";

                return (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                       <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {txnId.length > 20 ? `${txnId.substring(0, 20)}...` : txnId}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-blue-600 text-sm">
                      {t.orderNumber || `#${t._id.slice(-8)}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-gray-900">
                        {t.user?.name || "Guest"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(t.paymentMethod)}
                        <span className="text-sm font-medium text-gray-700 capitalize">
                           {t.paymentMethod?.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{t.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="w-4 h-4" />
                        Success
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <CurrencyDollarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
          <p className="text-gray-500">There are no successful payments matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
