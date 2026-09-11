import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
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

          {/* Mobile Card View */}
          <div className="lg:hidden flex flex-col gap-4">
            {users?.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-3 transition hover:shadow-md">
                <div className="flex flex-col border-b border-gray-100 pb-3">
                  <span className="font-bold text-gray-800 text-lg">{product.name}</span>
                  <span className="text-gray-500 text-sm">{product.email}</span>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{product?.phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{getDateInFormat(product.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Login:</span>
                    <span>{getDateInFormat(product.lastLogin)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
