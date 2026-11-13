"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { deleteProduct, deleteMultipleProducts, updateMultipleProductPrices, getProducts, getCategories } from "../../api-services/apiService";
import { toast } from 'react-toastify';
import Select from "react-select";
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';
import AddEditProduct from "./AddEditProduct";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [bulkNewPrice, setBulkNewPrice] = useState("");
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  /* -------------------- FETCH PRODUCTS -------------------- */
  const fetchAllProducts = async () => {
    setLoading(true);
    const resData = await getProducts({ limit: 1000 });

    if (resData?.success) {
      setProducts(resData.data?.data || resData.data || []);
    } else {
      setProducts([]);
      toast.error("Failed to load products.");
    }

    setLoading(false);
  };

  const fetchAllCategories = async () => {
    const resData = await getCategories();
    if (resData?.success) {
      setCategories(resData.data?.data || resData.data || []);
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.resolve();
      fetchAllProducts();
      fetchAllCategories();
    })();
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

  const filteredByCategoryProducts = products.filter(p => {
    return selectedCategory ? (p.category?._id === selectedCategory || p.category === selectedCategory) : true;
  });

  const filteredProducts = filteredByCategoryProducts.filter(p => 
    p.name?.toLowerCase().includes(globalFilter.toLowerCase()) || 
    p.category?.name?.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const handleBulkUpdatePrice = async () => {
    if (selectedProducts.length === 0) return;
    if (!bulkNewPrice || isNaN(Number(bulkNewPrice)) || Number(bulkNewPrice) < 0) {
      toast.error("Please enter a valid positive number for the new price.");
      return;
    }

    setUpdatingPrice(true);
    const productIds = selectedProducts.map(p => p._id);
    const resData = await updateMultipleProductPrices(productIds, Number(bulkNewPrice));

    if (resData?.success) {
      setIsPriceModalOpen(false);
      setBulkNewPrice("");
      setSelectedProducts([]);
      fetchAllProducts();
    } else {
      toast.error(resData?.message || "Something went wrong.");
    }
    setUpdatingPrice(false);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-2 border-b border-[#e1b382]/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">
            Product Catalog
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Manage resin art, crochet creations, and custom gift inventory.</p>
        </div>

        <div className="flex w-full sm:w-auto flex-col sm:flex-row justify-end items-center gap-2 sm:gap-3">
          {selectedProducts.length > 0 && (
            <>
              <button
                onClick={() => setIsPriceModalOpen(true)}
                className="w-full sm:w-auto bg-[#c89666] text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm hover:bg-[#b07f50] transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold active:scale-95"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Update Price ({selectedProducts.length})</span>
              </button>
              <button
                onClick={deleteSelectedProducts}
                className="w-full sm:w-auto bg-red-600 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold active:scale-95"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Delete ({selectedProducts.length})</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingProductId(null);
              setIsProductModalOpen(true);
            }}
            className="w-full sm:w-auto bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold active:scale-95"
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1b382]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="w-full sm:w-72 relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#12343b]/20 focus:border-[#12343b] shadow-sm"
          />
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64 text-xs sm:text-sm">
          <Select
            value={selectedCategory ? { value: selectedCategory, label: categories.find(c => c._id === selectedCategory)?.name } : null}
            onChange={(selectedOption) => setSelectedCategory(selectedOption ? selectedOption.value : "")}
            options={[{ value: "", label: "All Categories" }, ...categories.map(cat => ({ value: cat._id, label: cat.name }))]}
            className="basic-single w-full"
            classNamePrefix="select"
            placeholder="All Categories"
            isClearable
          />
        </div>
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
              value={filteredByCategoryProducts} 
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
              globalFilter={globalFilter}
              globalFilterFields={['name', 'category.name']}
              emptyMessage="No products found matching your search."
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
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(rowData._id);
                      setIsProductModalOpen(true);
                    }}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

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
            {filteredProducts.map((product) => {
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
                    <span className="font-serif font-bold text-[#12343b] text-sm sm:text-base leading-tight line-clamp-2 mb-0.5">{product.name}</span>
                    <span className="text-stone-500 text-[11px] sm:text-xs font-medium mb-1.5">{product.category?.name || "Uncategorized"}</span>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <span className="font-serif font-bold text-[#12343b] text-sm sm:text-base">₹{product.price}</span>
                      <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                        product.stock > 10 ? "bg-emerald-100 text-emerald-800" :
                        product.stock > 0 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-[#fcfaf7] px-3 py-2 border-t border-stone-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(product._id);
                      setIsProductModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-[#12343b] hover:bg-[#e1b382]/15 transition shadow-sm active:scale-95"
                  >
                    <PencilIcon className="w-3.5 h-3.5 text-[#12343b]" /> <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteProductById(product._id)}
                    disabled={deletingId === product._id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white border border-red-200 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition shadow-sm disabled:opacity-50 active:scale-95"
                  >
                    {deletingId === product._id ? "..." : <><TrashIcon className="w-3.5 h-3.5" /> <span>Delete</span></>}
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

      {/* Bulk Update Price Modal */}
      <Dialog
        header={
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c89666]">Bulk Catalog Update</p>
            <h3 className="text-base sm:text-xl font-serif font-bold text-[#12343b]">
              Update Price ({selectedProducts.length} Selected)
            </h3>
          </div>
        }
        visible={isPriceModalOpen}
        style={{ width: '92vw', maxWidth: '420px' }}
        onHide={() => !updatingPrice && setIsPriceModalOpen(false)}
        dismissableMask={!updatingPrice}
        className="rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#e1b382]/30"
        headerClassName="px-4 py-3 sm:px-6 sm:py-4 bg-[#fcfaf7] border-b border-stone-100"
        contentClassName="p-4 sm:p-6"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              New Price for All Selected (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={bulkNewPrice}
              onChange={(e) => setBulkNewPrice(e.target.value)}
              placeholder="e.g. 499"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-[#fcfaf7] rounded-xl focus:ring-2 focus:ring-[#12343b]/20 focus:border-[#12343b] focus:bg-white outline-none transition"
              min="0"
              disabled={updatingPrice}
            />
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100 mt-2">
            <button
              onClick={() => setIsPriceModalOpen(false)}
              disabled={updatingPrice}
              className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-100 transition active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpdatePrice}
              disabled={updatingPrice || !bulkNewPrice}
              className="min-h-[40px] px-5 py-2 text-xs sm:text-sm font-semibold text-[#e1b382] bg-[#12343b] hover:bg-[#0e272d] border border-[#e1b382]/30 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {updatingPrice ? "Updating..." : "Update Prices"}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add / Edit Product Modal */}
      <Dialog
        header={
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#c89666]">Catalog Manager</p>
            <h3 className="text-base sm:text-xl font-serif font-bold text-[#12343b]">
              {editingProductId ? "Edit Product" : "Add New Product"}
            </h3>
          </div>
        }
        visible={isProductModalOpen}
        style={{ width: '96vw', maxWidth: '1050px' }}
        className="rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#e1b382]/30"
        headerClassName="px-4 py-3 sm:px-6 sm:py-4 bg-[#fcfaf7] border-b border-stone-100"
        contentClassName="!p-0 bg-white"
        onHide={() => {
          setIsProductModalOpen(false);
          setEditingProductId(null);
        }}
        dismissableMask={false}
        maximizable
      >
        <div className="max-h-[82vh] overflow-y-auto overscroll-contain px-3 sm:px-6 py-4">
          <AddEditProduct
            key={editingProductId || 'new'}
            productId={editingProductId}
            embedded={true}
            onClose={() => {
              setIsProductModalOpen(false);
              setEditingProductId(null);
            }}
            onSuccess={() => {
              setIsProductModalOpen(false);
              setEditingProductId(null);
              fetchAllProducts();
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}
