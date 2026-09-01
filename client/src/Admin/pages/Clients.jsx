import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clients</h1>

        {/* <Link
          to="/admin/products/add"
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 flex items-center justify-center gap-2 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </Link> */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-10"><LogoLoader label="Loading users..." compact /></div>
      )}

      {/* Empty State */}
      {!loading && users?.length === 0 && (
        <div className="text-center py-16 text-gray-500">No Users found.</div>
      )}

      {/* Table */}
      {!loading && users.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto w-full">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Last Login
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users?.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">₹{product.email}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {product?.phone || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {getDateInFormat(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {getDateInFormat(product.lastLogin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
