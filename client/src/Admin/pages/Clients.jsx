import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PencilIcon, TrashIcon, PlusIcon, PhoneIcon, CalendarDaysIcon, ClockIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  deleteProduct,
  getAllUser,
  getProducts,
} from "../../api-services/apiService";
import { getDateInFormat } from "../../utils/commonService";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.031 21.996c-1.636 0-3.238-.426-4.662-1.233L2 22l1.267-5.26C2.428 15.308 2 13.676 2 12.008 2 6.485 6.505 2 12.031 2 17.558 2 22.062 6.485 22.062 12.008c0 5.524-4.504 10.009-10.031 9.988zm-.005-18.498c-4.686 0-8.508 3.818-8.508 8.51 0 1.5.393 2.964 1.14 4.254l-.744 3.09 3.16-.729c1.246.685 2.656 1.047 4.092 1.047h.003c4.685 0 8.505-3.816 8.505-8.51 0-4.693-3.82-8.51-8.508-8.51zm4.673 11.666c-.256-.128-1.517-.749-1.751-.834-.235-.086-.406-.128-.577.128-.171.257-.662.834-.812 1.005-.15.171-.299.193-.555.064-.256-.128-1.082-.399-2.062-1.272-.763-.679-1.277-1.518-1.427-1.774-.15-.257-.016-.396.112-.524.115-.115.256-.3.384-.45.128-.15.171-.257.256-.428.086-.171.043-.321-.021-.45-.064-.128-.577-1.391-.79-1.905-.208-.501-.42-.433-.577-.441-.15-.009-.321-.009-.492-.009-.171 0-.449.064-.684.321-.235.257-.897.877-.897 2.138 0 1.261.919 2.481 1.047 2.652.128.171 1.81 2.76 4.381 3.844.612.257 1.089.411 1.463.526.614.195 1.173.167 1.614.101.492-.073 1.517-.62 1.73-1.22.214-.599.214-1.112.15-1.22-.064-.107-.235-.171-.491-.299z"/>
  </svg>
);

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
              <Column header="Actions" body={(rowData) => {
                const phone = rowData.phone;
                return (
                  <div className="flex gap-2">
                    <a href={`mailto:${rowData.email}`} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition shadow-sm border border-gray-200" title="Email">
                      <EnvelopeIcon className="w-4 h-4" />
                    </a>
                    {phone && (
                      <a href={`tel:${phone}`} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition shadow-sm border border-blue-200" title="Call">
                        <PhoneIcon className="w-4 h-4" />
                      </a>
                    )}
                    {phone && (
                      <a href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition shadow-sm border border-green-200" title="WhatsApp">
                        <WhatsAppIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                );
              }}></Column>
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

                <div className="flex items-center gap-2 mt-1 pt-3 border-t border-gray-100">
                  <a href={`mailto:${product.email}`} className="flex-1 flex justify-center items-center gap-2 py-2 bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm rounded-xl border border-gray-200 active:bg-gray-100 shadow-sm transition">
                    <EnvelopeIcon className="w-4 h-4" /> Email
                  </a>
                  {product.phone && (
                    <a href={`tel:${product.phone}`} className="flex-1 flex justify-center items-center gap-2 py-2 bg-blue-50 text-blue-700 font-medium text-xs sm:text-sm rounded-xl border border-blue-100 active:bg-blue-100 shadow-sm transition">
                      <PhoneIcon className="w-4 h-4" /> Call
                    </a>
                  )}
                  {product.phone && (
                    <a href={`https://wa.me/${product.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-2 bg-green-50 text-green-700 font-medium text-xs sm:text-sm rounded-xl border border-green-100 active:bg-green-100 shadow-sm transition">
                      <WhatsAppIcon className="w-4 h-4" /> Chat
                    </a>
                  )}
                </div>
              </div>
            )})}
          </div>
        </>
      )}
    </div>
  );
}
