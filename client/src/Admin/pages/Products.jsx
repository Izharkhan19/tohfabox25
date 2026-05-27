import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { deleteProduct, getProducts } from "../../api-services/apiService";
import { toast } from 'react-toastify';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchAllProducts = async () => {
    setLoading(true);
    const resData = await getProducts();

    if (resData?.success) {
      setProducts(resData.data?.data || resData.data || []);
    } else {
      setProducts([]);
      toast.error("Failed to load products.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  /* -------------------- DELETE PRODUCT -------------------- */
  const deleteProductById = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Products</h1>

        <Link
          to="/admin/products/add"
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 flex items-center justify-center gap-2 transition"
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading products...
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No products found.
        </div>
      )}

      {/* Table */}
      {!loading && products.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto w-full">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">₹{product.price}</td>

                  <td className="px-6 py-4 text-gray-700">
                    {product?.category?.name || "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{product.stock}</td>

                  <td className="px-6 py-4 flex gap-3">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>

                    <button
                      onClick={() => deleteProductById(product._id)}
                      disabled={deletingId === product._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-40"
                    >
                      {deletingId === product._id ? (
                        "..."
                      ) : (
                        <TrashIcon className="w-5 h-5" />
                      )}
                    </button>
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
