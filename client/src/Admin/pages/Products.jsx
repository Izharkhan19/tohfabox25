import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { deleteProduct, deleteMultipleProducts, getProducts } from "../../api-services/apiService";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${selectedProducts.length} products?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    const productIds = selectedProducts.map(p => p._id);
    const resData = await deleteMultipleProducts(productIds);

    if (resData?.success) {
      setSelectedProducts([]);
      fetchAllProducts();
    } else {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  const onMobileSelect = (e, product) => {
    let _selectedProducts = [...selectedProducts];
    if (e.checked) {
        _selectedProducts.push(product);
    } else {
        _selectedProducts = _selectedProducts.filter(p => p._id !== product._id);
    }
    setSelectedProducts(_selectedProducts);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        {selectedProducts.length > 0 && (
          <button
            onClick={deleteSelectedProducts}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl shadow-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Delete Selected ({selectedProducts.length})</span>
          </button>
        )}
        <Link
          to="/admin/products/add"
          className="w-full sm:w-auto bg-gray-900 text-white px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-10"><LogoLoader label="Loading products..." compact /></div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No products found.
        </div>
      )}

      {/* Desktop Table & Mobile Cards */}
      {!loading && products.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden w-full">
            <DataTable 
              value={products} 
              selection={selectedProducts} 
              onSelectionChange={(e) => setSelectedProducts(e.value)} 
              dataKey="_id"
              paginator 
              rows={10} 
              rowsPerPageOptions={[5, 10, 25, 50]} 
              tableStyle={{ minWidth: '50rem' }}
              className="p-datatable-sm"
              rowHover
              stripedRows
            >
              <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
              <Column header="Product" body={(rowData) => (
                <div className="flex items-center gap-3 py-1">
                  {rowData.images && rowData.images.length > 0 ? (
                    <img 
                      src={rowData.images[0].url} 
                      alt={rowData.name} 
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 cursor-pointer hover:opacity-80 transition"
                      onClick={() => setPreviewImage(rowData.images[0].url)}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-[10px] border border-gray-200 uppercase font-bold text-center">No Img</div>
                  )}
                  <span className="font-bold text-gray-800">{rowData.name}</span>
                </div>
              )} sortable sortField="name"></Column>
              <Column field="price" header="Price" body={(rowData) => `₹${rowData.price}`} sortable></Column>
              <Column field="category.name" header="Category" body={(rowData) => rowData.category?.name || "—"} sortable></Column>
              <Column field="stock" header="Stock" sortable></Column>
              <Column header="Actions" body={(rowData) => (
                <div className="flex gap-3">
                  <Link
                    to={`/admin/products/edit/${rowData._id}`}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => deleteProductById(rowData._id)}
                    disabled={deletingId === rowData._id}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 rounded-lg transition"
                    title="Delete"
                  >
                    {deletingId === rowData._id ? (
                      <span className="w-4 h-4 text-xs">...</span>
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}></Column>
            </DataTable>
          </div>

          {/* Mobile Card View (Premium Layout) */}
          <div className="lg:hidden flex flex-col gap-4">
            {products.map((product) => {
              const isSelected = selectedProducts.some(p => p._id === product._id);
              return (
                <div key={product._id} className={`bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${isSelected ? 'border-blue-500' : 'border-gray-100'} overflow-hidden flex flex-col transition hover:shadow-md`}>
                  <div className="flex p-3 sm:p-4 gap-3 items-start">
                    {/* Checkbox */}
                    <div className="pt-1">
                      <Checkbox checked={isSelected} onChange={(e) => onMobileSelect(e, product)} />
                    </div>

                    {/* Image */}
                    <div className="shrink-0">
                      {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.name} 
                        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg sm:rounded-xl shadow-sm cursor-pointer border border-gray-100"
                        onClick={() => setPreviewImage(product.images[0].url)}
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 text-[10px] sm:text-xs font-medium border border-gray-100">No Img</div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1 py-0 min-w-0">
                    <span className="font-bold text-gray-800 text-sm sm:text-lg leading-tight line-clamp-2 mb-0.5">{product.name}</span>
                    <span className="text-gray-500 text-xs sm:text-sm font-medium mb-1.5">{product.category?.name || "Uncategorized"}</span>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-bold text-blue-600 text-base sm:text-lg">₹{product.price}</span>
                      <span className={`text-[10px] sm:text-sm font-medium px-2 py-0.5 rounded-full ${
                        product.stock > 10 ? "bg-green-100 text-green-700" :
                        product.stock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50/50 px-3 py-2 sm:px-4 sm:py-3 border-t border-gray-100 flex justify-end gap-2">
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition shadow-sm"
                  >
                    <PencilIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => deleteProductById(product._id)}
                    disabled={deletingId === product._id}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition shadow-sm disabled:opacity-50"
                  >
                    {deletingId === product._id ? "..." : <><TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Delete</span></>}
                  </button>
                </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Image Preview Modal */}
      <Dialog 
        header="Image Preview" 
        visible={!!previewImage} 
        style={{ width: '90vw', maxWidth: '600px' }} 
        onHide={() => setPreviewImage(null)} 
        dismissableMask
      >
        <div className="flex justify-center p-2 bg-gray-50 rounded-lg">
          <img src={previewImage} alt="Preview" className="max-w-full h-auto max-h-[70vh] object-contain rounded shadow-sm" />
        </div>
      </Dialog>
    </div>
  );
}
