// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function AddEditProduct() {
//     const navigate = useNavigate();
//     const [images, setImages] = useState([]);

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(files);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         toast.success("Product saved!");
//         navigate("/products");
//     };

//     return (
//         <div className="max-w-5xl mx-auto">
//             {/* Page Title */}
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

//             <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
//                 <form onSubmit={handleSubmit}>

//                     {/* Product Basic Info */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block mb-1 font-semibold text-gray-700">
//                                 Product Name
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="Enter product name"
//                                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-semibold text-gray-700">
//                                 Price (₹)
//                             </label>
//                             <input
//                                 type="number"
//                                 placeholder="Enter price"
//                                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-semibold text-gray-700">
//                                 Stock
//                             </label>
//                             <input
//                                 type="number"
//                                 placeholder="Enter stock quantity"
//                                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block mb-1 font-semibold text-gray-700">
//                                 Category
//                             </label>
//                             <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400">
//                                 <option>Electronics</option>
//                                 <option>Clothing</option>
//                                 <option>Home</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <div className="mt-6">
//                         <label className="block mb-2 font-semibold text-gray-700">
//                             Description
//                         </label>
//                         <textarea
//                             rows="4"
//                             placeholder="Write product details..."
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//                             required
//                         ></textarea>
//                     </div>

//                     {/* Image Upload */}
//                     <div className="mt-8">
//                         <label className="block mb-2 font-semibold text-gray-700">
//                             Upload Images
//                         </label>

//                         <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition relative">
//                             <input
//                                 type="file"
//                                 multiple
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             />
//                             <p className="text-gray-600 pointer-events-none">
//                                 Drag & drop files here or click to upload
//                             </p>
//                         </div>

//                         {/* Preview thumbnails */}
//                         {images.length > 0 && (
//                             <div className="mt-4 flex gap-3 flex-wrap">
//                                 {images.map((img, i) => (
//                                     <div key={i} className="w-24 h-24 border rounded overflow-hidden">
//                                         <img
//                                             src={URL.createObjectURL(img)}
//                                             alt="preview"
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Buttons */}
//                     <div className="mt-10 flex gap-4">
//                         <button
//                             type="submit"
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md"
//                         >
//                             Save Product
//                         </button>

//                         <button
//                             type="button"
//                             onClick={() => navigate("/products")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }
// src/Admin/pages/AddEditProduct.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  createProduct,
  updateProduct,
  getProduct,
  getCategories,
} from "../../api-services/apiService";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    isFeatured: false,
  });

  const [images, setImages] = useState([]); // New files to upload
  const [existingImages, setExistingImages] = useState([]); // Existing images from backend

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Load product in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        setLoadingProduct(true);
        setError(null);
        try {
          const res = await getProduct(id);
          if (res.success && res.data) {
            const product = res.data?.data;

            setFormData({
              name: product.name || "",
              price: product.price || "",
              stock: product.stock || "",
              category: product.category?._id || product.category || "",
              description: product.description || "",
              isFeatured: product.isFeatured || false,
            });
            setExistingImages(product.images || []);
          } else {
            setError("Product not found");
          }
        } catch (err) {
          console.error("Failed to load product", err);
          setError("Failed to load product details");
        } finally {
          setLoadingProduct(false);
        }
      };
      loadProduct();
    }
  }, [id, isEditMode]);
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > maxImages) {
      toast.info(`Maximum ${maxImages} images allowed.`);
      e.target.value = null;
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) =>
      prev.filter((img) => (img._id || img.public_id) !== imageId),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("isFeatured", formData.isFeatured);

    // Append new images
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    // Append existing images to keep (edit mode only)
    if (isEditMode) {
      existingImages.forEach((img) => {
        formDataToSend.append("existingImages", img._id || img.public_id);
      });
    }

    try {
      let response;
      if (isEditMode) {
        // Independent PUT call for update
        response = await axios.put(
          `${API_BASE_URL}/products/${id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") || ""
              }`,
            },
          },
        );
      } else {
        // Independent POST call for create
        response = await axios.post(
          `${API_BASE_URL}/products`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                localStorage.getItem("adminToken") || ""
              }`,
            },
          },
        );
      }

      const result = response.data;

      if (result.success) {
        toast.success(
          `Product ${isEditMode ? "updated" : "added"} successfully!`,
        );
        navigate("/admin/products");
      } else {
        setError(result.message || "Failed to save product");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (img) =>
    img.url || img.secure_url || URL.createObjectURL(img);
  const getImageId = (img) => img._id || img.public_id || img.name;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <hr />

      {loadingProduct ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : (
        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-md border border-gray-100 mt-6 sm:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">
                  Category
                </label>
                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block mb-3 font-semibold text-gray-700">
                  Is Featured
                </label>
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-gray-600">
                    {formData.isFeatured
                      ? "Marked as Featured Product"
                      : "Not featured"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mt-8">
              <label className="block mb-2 font-semibold text-gray-700">
                Product Images
              </label>

              {/* Existing Images (Edit Mode) */}
              {isEditMode && existingImages.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Current Images</p>
                  <div className="flex gap-4 flex-wrap">
                    {existingImages.map((img) => (
                      <div key={getImageId(img)} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt="product"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(getImageId(img))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Upload */}
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
                <p className="text-gray-600">
                  Drop images here or click to upload
                </p>
              </div>

              {/* New Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 flex gap-4 flex-wrap">
                  {images.map((file, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

            <div className="mt-8 sm:mt-10 flex flex-col-reverse sm:flex-row gap-4 sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="w-full sm:w-auto px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || loadingProduct}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-70"
              >
                {saving
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
