import { useState, useEffect } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-white flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg text-blue-600">
             <CurrencyDollarIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Total Revenue (Paid)</div>
            <div className="text-xl sm:text-2xl font-bold">
              ₹{transactions.reduce((sum, t) => sum + (t.total || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-white flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-green-100 rounded-lg text-green-600">
             <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Successful Transactions</div>
            <div className="text-xl sm:text-2xl font-bold">{transactions.length}</div>
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

      {/* Transactions Table & Mobile Cards */}
      {!loading && filteredTransactions.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl shadow border overflow-hidden w-full">
            <DataTable 
              value={filteredTransactions} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]} 
              tableStyle={{ minWidth: '60rem' }}
              className="p-datatable-sm"
              rowHover
              stripedRows
            >
              <Column header="Transaction ID" body={(rowData) => {
                const txnId = rowData.paymentDetails?.transactionId || "N/A";
                return (
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {txnId.length > 20 ? `${txnId.substring(0, 20)}...` : txnId}
                  </span>
                );
              }} sortable sortField="paymentDetails.transactionId"></Column>
              <Column header="Order ID" body={(rowData) => (
                <span className="font-mono text-blue-600 text-sm">
                  {rowData.orderNumber || `#${rowData._id.slice(-8)}`}
                </span>
              )} sortable sortField="orderNumber"></Column>
              <Column header="Date" body={(rowData) => {
                return rowData.paymentDetails?.paidAt ? new Date(rowData.paymentDetails.paidAt).toLocaleString() : "N/A";
              }} sortable sortField="paymentDetails.paidAt"></Column>
              <Column header="Customer" body={(rowData) => (
                <div>
                  <div className="font-medium text-sm text-gray-900">{rowData.user?.name || "Guest"}</div>
                  <div className="text-xs text-gray-500">{rowData.user?.email}</div>
                </div>
              )} sortable sortField="user.name"></Column>
              <Column header="Method" body={(rowData) => (
                <div className="flex items-center gap-2">
                  {getPaymentMethodIcon(rowData.paymentMethod)}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {rowData.paymentMethod?.replace('_', ' ')}
                  </span>
                </div>
              )} sortable sortField="paymentMethod"></Column>
              <Column header="Amount" body={(rowData) => (
                <span className="font-bold text-gray-900">₹{rowData.total?.toFixed(2)}</span>
              )} sortable sortField="total"></Column>
              <Column header="Status" body={() => (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="w-4 h-4" />
                  Success
                </span>
              )}></Column>
            </DataTable>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden flex flex-col gap-3 sm:gap-4">
            {filteredTransactions.map((t) => {
              const txnId = t.paymentDetails?.transactionId || "N/A";
              const date = t.paymentDetails?.paidAt ? new Date(t.paymentDetails.paidAt).toLocaleString() : "N/A";

              return (
                <div key={t._id} className="bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 transition hover:shadow-md">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-all">
                      {txnId}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Success
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500 text-xs sm:text-sm">Order ID:</span>
                      <span className="font-mono text-blue-600 text-sm font-semibold">{t.orderNumber || `#${t._id.slice(-8)}`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-500 text-xs sm:text-sm">Date:</span>
                      <span className="text-gray-700 text-xs sm:text-sm text-right">{date}</span>
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg flex flex-col gap-0.5 sm:gap-1">
                    <div className="font-medium text-sm text-gray-900">{t.user?.name || "Guest"}</div>
                    <div className="text-xs sm:text-sm text-gray-500 break-all">{t.user?.email}</div>
                  </div>

                  <div className="flex justify-between items-center mt-1 sm:mt-2 pt-2 sm:pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(t.paymentMethod)}
                      <span className="text-xs sm:text-sm font-medium text-gray-700 capitalize">
                         {t.paymentMethod?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="font-bold text-base sm:text-lg text-gray-900">
                      ₹{t.total?.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
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
