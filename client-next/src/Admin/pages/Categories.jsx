"use client";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, TagIcon } from "@heroicons/react/24/outline";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api-services/apiService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Categories() {
  /* -------------------- STATE -------------------- */
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "Product" });

  /* -------------------- API CALLS -------------------- */
  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError(null);

    const result = await getCategories();
    if (result?.success) {
      setCategories(result?.data?.data || []);
    } else {
      setCategories([]);
      setCategoriesError("Failed to load categories");
    }

    setLoadingCategories(false);
  };

  const saveCategory = async () => {
    setSaving(true);
    try {
      const payload = { name: formData.name.trim(), type: formData.type };
      return editingCategory
        ? await updateCategory(editingCategory._id, payload)
        : await createCategory(payload);
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (id) => {
    setDeletingId(id);
    try {
      return await deleteCategory(id);
    } finally {
      setDeletingId(null);
    }
  };

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    (async () => {
      await Promise.resolve();
      fetchCategories();
    })();
  }, []);

  /* -------------------- HANDLERS -------------------- */
  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({ name: category?.name || "", type: category?.type || "Product" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", type: "Product" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const result = await saveCategory();
    if (result?.success) {
      toast.success(editingCategory ? "Category updated successfully" : "Category created successfully");
      fetchCategories();
      closeModal();
    } else {
      toast.error(result?.message || "Unable to save category");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this category? Products will become uncategorized.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    const apiResult = await removeCategory(id);
    if (apiResult?.success) {
      toast.success("Category deleted successfully");
      fetchCategories();
    } else {
      toast.error(apiResult?.message || "Failed to delete category");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pb-2 border-b border-[#e1b382]/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">
            Product Categories
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Organize handcrafted items into store collections and curated themes.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm font-semibold text-xs sm:text-sm active:scale-95 transition"
        >
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1b382]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Loading */}
      {loadingCategories && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 animate-pulse"
            >
              <div className="h-6 bg-stone-200 rounded w-3/4 mb-3" />
              <div className="h-10 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {categoriesError && !loadingCategories && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6">
          <p className="text-red-600 text-sm font-medium">{categoriesError}</p>
          <button
            onClick={fetchCategories}
            className="mt-3 px-4 py-2 bg-[#12343b] text-[#e1b382] rounded-xl text-xs sm:text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {!loadingCategories && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-3.5 sm:p-5 hover:border-[#e1b382]/50 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#12343b] truncate">{category.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] bg-[#12343b]/10 text-[#12343b] px-2 py-0.5 rounded-full font-bold">
                      {category.type || 'Product'}
                    </span>
                    <span className="text-[11px] text-stone-400 truncate">
                      /{category.slug || "slug"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openModal(category)}
                    className="p-1.5 text-[#12343b] hover:bg-[#e1b382]/20 rounded-lg active:scale-95 transition"
                    title="Edit Category"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={deletingId === category._id}
                    title={category.productCount > 0 ? "Contains products" : "Delete category"}
                    aria-label={`Delete ${category.name}`}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 active:scale-95 transition"
                  >
                    {deletingId === category._id ? (
                      <span className="block h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                    ) : (
                      <TrashIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-2.5 flex justify-between items-baseline">
                <span className="text-[11px] text-stone-400">Catalog items:</span>
                <span className="font-serif font-bold text-[#12343b] text-base">
                  {category.productCount || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loadingCategories && categories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-6">
          <TagIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-base font-serif font-bold text-stone-700">
            No categories found
          </h3>
          <p className="text-xs text-stone-500 mt-1">Add your first product or collection category to begin.</p>
          <button
            onClick={() => openModal()}
            className="mt-4 bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 transition"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          role="presentation"
        >
          <div 
            className="w-full max-w-md max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[#e1b382]/30 bg-white shadow-2xl animate-in slide-in-from-bottom duration-200" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="category-modal-title"
          >
            {/* Header Section (Sticky) */}
            <div className="shrink-0 flex items-center justify-between border-b border-stone-100 bg-[#fcfaf7] px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#c89666]">Catalog Organization</p>
                <h2 id="category-modal-title" className="text-base sm:text-xl font-serif font-bold text-[#12343b]">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h2>
              </div>
              <button 
                type="button" 
                onClick={closeModal} 
                aria-label="Close dialog" 
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 transition"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form wrapping body + sticky footer */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Body Section (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7] px-3.5 py-2.5 text-sm text-[#12343b] outline-none transition focus:border-[#12343b] focus:bg-white focus:ring-2 focus:ring-[#12343b]/20"
                    placeholder="e.g. Crochet Decor"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 bg-[#fcfaf7] px-3.5 py-2.5 text-sm text-[#12343b] outline-none transition focus:border-[#12343b] focus:bg-white focus:ring-2 focus:ring-[#12343b]/20"
                    required
                  >
                    <option value="Product">Product Category</option>
                    <option value="Occasion">Occasion</option>
                    <option value="Relationship">Relationship</option>
                  </select>
                </div>
              </div>

              {/* Footer Section (Sticky) */}
              <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-stone-100 bg-[#fcfaf7]/70 flex items-center justify-end gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-100 transition active:scale-95 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial min-h-[42px] px-5 py-2 text-xs sm:text-sm font-semibold text-[#e1b382] bg-[#12343b] hover:bg-[#0e272d] border border-[#e1b382]/30 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50 text-center"
                >
                  {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
