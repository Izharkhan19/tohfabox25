// import { useEffect, useState } from "react";
// import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
// import { useApi } from "../../api-services/hooks/useApi";
// import {
//     getCategories,
//     createCategory,
//     updateCategory,
//     deleteCategory,
// } from "../../api-services/apiService";

// export default function Categories() {
//     const {
//         data: categories = [],
//         loading: loadingCategories,
//         error: categoriesError,
//         request: fetchCategories,
//     } = useApi(getCategories);

//     const { request: saveCategory, loading: saving } = useApi((data) =>
//         editingCategory
//             ? updateCategory(editingCategory._id, data)
//             : createCategory(data)
//     );

//     const { request: removeCategory, loading: deletingId } =
//         useApi(deleteCategory);

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);
//     const [formData, setFormData] = useState({ name: "" });

//     // Load categories on mount
//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const openModal = (category = null) => {
//         setEditingCategory(category);
//         setFormData({ name: category?.name || "" });
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingCategory(null);
//         setFormData({ name: "" });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.name.trim()) return;

//         const result = await saveCategory({ name: formData.name.trim() });

//         if (result.success) {
//             fetchCategories(); // Refresh list
//             closeModal();
//         }
//     };

//     const handleDelete = async (id) => {
//         if (
//             !window.confirm(
//                 "Delete this category? Products will become uncategorized."
//             )
//         )
//             return;

//         const result = await removeCategory(id);
//         if (result.success) {
//             fetchCategories();
//         }
//     };

//     return (
//         // <div className="max-w-7xl mx-auto p-6">
//         <div className="p-6">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
//                     <p className="text-gray-600 mt-1">
//                         Organize your products effectively
//                     </p>
//                 </div>

//                 <button
//                     onClick={() => openModal()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition"
//                 >
//                     <PlusIcon className="w-5 h-5" />
//                     Add Category
//                 </button>
//             </div>

//             {/* Loading State */}
//             {loadingCategories && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {[...Array(6)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="bg-white rounded-xl p-6 shadow-sm border animate-pulse"
//                         >
//                             <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
//                             <div className="h-20 bg-gray-100 rounded"></div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Error State */}
//             {categoriesError && !loadingCategories && (
//                 <div className="text-center py-16">
//                     <p className="text-red-600 text-lg">Failed to load categories</p>
//                     <button
//                         onClick={fetchCategories}
//                         className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             )}

//             {/* Categories Grid */}
//             {!loadingCategories && categories?.length > 0 && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {categories?.map((category) => (
//                         <div
//                             key={category._id}
//                             className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                         >
//                             <div className="flex justify-between items-start mb-5">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-gray-800">
//                                         {category.name}
//                                     </h3>
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         /{category.slug || "no-slug"}
//                                     </p>
//                                 </div>

//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={() => openModal(category)}
//                                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                                     >
//                                         <PencilIcon className="w-5 h-5" />
//                                     </button>

//                                     <button
//                                         onClick={() => handleDelete(category._id)}
//                                         disabled={
//                                             deletingId === category._id ||
//                                             (category.productCount ?? 0) > 0
//                                         }
//                                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
//                                         title={
//                                             category.productCount > 0
//                                                 ? "Cannot delete: has products"
//                                                 : "Delete"
//                                         }
//                                     >
//                                         {deletingId === category._id ? (
//                                             <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
//                                                 <circle
//                                                     cx="12"
//                                                     cy="12"
//                                                     r="10"
//                                                     stroke="currentColor"
//                                                     strokeWidth="4"
//                                                     fill="none"
//                                                     className="opacity-25"
//                                                 />
//                                                 <path
//                                                     fill="currentColor"
//                                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                                     className="opacity-75"
//                                                 />
//                                             </svg>
//                                         ) : (
//                                             <TrashIcon className="w-5 h-5" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="pt-4 border-t border-gray-100">
//                                 <div className="flex items-end justify-between">
//                                     <div>
//                                         <p className="text-3xl font-bold text-gray-800">
//                                             {category.productCount || 0}
//                                         </p>
//                                         <p className="text-sm text-gray-500">products</p>
//                                     </div>
//                                     {category.productCount > 0 && (
//                                         <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
//                                             Active
//                                         </span>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Empty State */}
//             {!loadingCategories && categories?.length === 0 && (
//                 <div className="text-center py-20">
//                     <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8 opacity-50" />
//                     <h3 className="text-2xl font-semibold text-gray-700">
//                         No categories found
//                     </h3>
//                     <p className="text-gray-500 mt-3 mb-8">
//                         Start by creating your first category
//                     </p>
//                     <button
//                         onClick={() => openModal()}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg flex items-center gap-3 mx-auto"
//                     >
//                         <PlusIcon className="w-6 h-6" />
//                         Create First Category
//                     </button>
//                 </div>
//             )}

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                             {editingCategory ? "Edit Category" : "Create New Category"}
//                         </h2>

//                         <form onSubmit={handleSubmit}>
//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     Category Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ name: e.target.value })}
//                                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
//                                     placeholder="e.g., Electronics, Fashion"
//                                     autoFocus
//                                     required
//                                 />
//                                 <p className="text-xs text-gray-500 mt-2">
//                                     Slug:{" "}
//                                     <span className="font-mono">
//                                         {formData.name.toLowerCase().replace(/\s+/g, "-") ||
//                                             "your-slug-will-appear-here"}
//                                     </span>
//                                 </p>
//                             </div>

//                             <div className="flex gap-4 justify-end">
//                                 <button
//                                     type="button"
//                                     onClick={closeModal}
//                                     className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={saving}
//                                     className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg disabled:opacity-70 transition flex items-center gap-2"
//                                 >
//                                     {saving ? (
//                                         <>
//                                             <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                                 <circle
//                                                     className="opacity-25"
//                                                     cx="12"
//                                                     cy="12"
//                                                     r="10"
//                                                     stroke="currentColor"
//                                                     strokeWidth="4"
//                                                 />
//                                                 <path
//                                                     className="opacity-75"
//                                                     fill="currentColor"
//                                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                                 />
//                                             </svg>
//                                             Saving...
//                                         </>
//                                     ) : editingCategory ? (
//                                         "Update Category"
//                                     ) : (
//                                         "Create Category"
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api-services/apiService";

export default function Categories() {
  /* -------------------- STATE -------------------- */
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

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

    const payload = { name: formData.name.trim() };
    const result = editingCategory
      ? await updateCategory(editingCategory._id, payload)
      : await createCategory(payload);

    setSaving(false);
    return result;
  };

  const removeCategory = async (id) => {
    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);
    return result;
  };

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    fetchCategories();
  }, []);

  /* -------------------- HANDLERS -------------------- */

  const openModal = (category = null) => {
    setEditingCategory(category);
    setFormData({ name: category?.name || "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const result = await saveCategory();
    if (result?.success) {
      fetchCategories();
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Products will become uncategorized."
      )
    )
      return;

    const result = await removeCategory(id);
    if (result?.success) {
      fetchCategories();
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Organize your products effectively
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Loading */}
      {loadingCategories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {categoriesError && !loadingCategories && (
        <div className="text-center py-16">
          <p className="text-red-600 text-lg">{categoriesError}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Categories */}
      {!loadingCategories && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    /{category.slug || "no-slug"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={
                      deletingId === category._id ||
                      (category.productCount ?? 0) > 0
                    }
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                  >
                    {deletingId === category._id ? (
                      "..."
                    ) : (
                      <TrashIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {category.productCount || 0}
                  </p>
                  <p className="text-sm text-gray-500">products</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loadingCategories && categories.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-700">
            No categories found
          </h3>
          <button
            onClick={() => openModal()}
            className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-xl"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl mb-6"
                placeholder="Category name"
                required
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl"
                >
                  {saving ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
