import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PencilIcon, TrashIcon, PlusIcon, PhoneIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  deleteProduct,
  getAllUser,
  getProducts,
} from "../../api-services/apiService";
import { getDateInFormat } from "../../utils/commonService";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchAllUsers = async () => {
    setLoading(true);
    const resData = await getAllUser();

    if (resData?.success) {
      // handle both possible response structures
      setUsers(resData.data?.data || resData.data || []);
    } else {
      setUsers([]);
      toast.error("Failed to load users.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  /* -------------------- DELETE PRODUCT -------------------- */
  const deleteProductById = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    const resData = await deleteProduct(id);

    if (resData?.success) {
      fetchAllProducts();
    } else {
      toast.error("Something went wrong.");
    }

    setDeletingId(null);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6">


      {/* Loading State */}
      {loading && (
        <div className="py-10"><LogoLoader label="Loading users..." compact /></div>
      )}

      {/* Empty State */}
      {!loading && users?.length === 0 && (
        <div className="text-center py-16 text-gray-500">No Users found.</div>
      )}

      {/* Table & Mobile Cards */}
      {!loading && users.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden w-full">
            <DataTable 
              value={users} 
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]} 
              tableStyle={{ minWidth: '50rem' }}
              className="p-datatable-sm"
              rowHover
              stripedRows
            >
              <Column field="name" header="Name" sortable></Column>
              <Column field="email" header="Email" sortable></Column>
              <Column field="phone" header="Phone" body={(rowData) => rowData.phone || "—"} sortable></Column>
              <Column field="createdAt" header="Created At" body={(rowData) => getDateInFormat(rowData.createdAt)} sortable></Column>
              <Column field="lastLogin" header="Last Login" body={(rowData) => getDateInFormat(rowData.lastLogin)} sortable></Column>
            </DataTable>
          </div>

          <div className="lg:hidden flex flex-col gap-4">
            {users?.map((product) => {
              const initial = product.name ? product.name.charAt(0).toUpperCase() : "U";
              return (
              <div key={product._id} className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-3 transition hover:shadow-md">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 border border-blue-100">
                    {initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-lg leading-tight">{product.name}</span>
                    <span className="text-gray-500 text-sm mt-0.5 break-all">{product.email}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex flex-col gap-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      <span>Phone</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {product?.phone || "—"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {getDateInFormat(product.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-50 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>Last Login:</span>
                  </div>
                  <span className="font-medium text-gray-700">{getDateInFormat(product.lastLogin)}</span>
                </div>
              </div>
            )})}
          </div>
        </>
      )}
    </div>
  );
}
