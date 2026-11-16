"use client";
// import { useRouter, useParams } from "next/navigation";
// import { useState } from "react";

// export default function AddEditProduct() {
//     const router = useRouter();
//     const [images, setImages] = useState([]);

//     const handleFileChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(files);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         toast.success("Product saved!");
//         router.push("/products");
//     };

//     return (
//         <div className="max-w-5xl mx-auto">
//             {/* Page Title */}
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

//             <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
//                 <form onSubmit={handleSubmit}>

//                     {/* Product Basic Info */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
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

//                         <div className="border-2 border-dashed border-gray-300 p-3.5 sm:p-6 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition relative">
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
//                             onClick={() => router.push("/products")}
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
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  createProduct,
  updateProduct,
  getProduct,
  getCategories,
} from "../../api-services/apiService";
import imageCompression from 'browser-image-compression';
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import LogoLoader from "../../components/LogoLoader";

export default function AddEditProduct({ productId, embedded = false, onClose, onSuccess }) {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const activeId = productId || id;
  const isEditMode = Boolean(activeId);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    occasions: [],
    relationships: [],
    description: "",
    isFeatured: false,
    weightValue: "",
    weightUnit: "kg",
    dimLength: "",
    dimWidth: "",
    dimHeight: "",
    dimUnit: "cm",
  });

  const [mainImage, setMainImage] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState(null);

  const [subImages, setSubImages] = useState([]);
  const [existingSubImages, setExistingSubImages] = useState([]);
  
  const [previewImage, setPreviewImage] = useState(null);

  const [productCategories, setProductCategories] = useState([]);
  const [occasionCategories, setOccasionCategories] = useState([]);
  const [relationshipCategories, setRelationshipCategories] = useState([]);
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
          const allCats = res.data?.data || [];
          setProductCategories(allCats.filter(c => c.type === 'Product' || !c.type));
          setOccasionCategories(allCats.filter(c => c.type === 'Occasion'));
          setRelationshipCategories(allCats.filter(c => c.type === 'Relationship'));
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
          const res = await getProduct(activeId);
          if (res.success && res.data) {
            const product = res.data?.data;

            setFormData({
              name: product.name || "",
              price: product.price || "",
              stock: product.stock || "",
              category: product.category?._id || product.category || "",
              occasions: product.occasions?.map(o => o._id || o) || [],
              relationships: product.relationships?.map(r => r._id || r) || [],
              description: product.description || "",
              isFeatured: product.isFeatured || false,
              weightValue: product.weight?.value || "",
              weightUnit: product.weight?.unit || "kg",
              dimLength: product.dimensions?.length || "",
              dimWidth: product.dimensions?.width || "",
              dimHeight: product.dimensions?.height || "",
              dimUnit: product.dimensions?.unit || "cm",
            });
            const primaryImg = product.images?.find(img => img.isPrimary);
            const secondaryImgs = product.images?.filter(img => !img.isPrimary) || [];
            
            setExistingMainImage(primaryImg || null);
            setExistingSubImages(secondaryImgs);
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
  }, [activeId, isEditMode]);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxArrayChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const array = prev[fieldName] || [];
      if (checked) {
        return { ...prev, [fieldName]: [...array, value] };
      } else {
        return { ...prev, [fieldName]: array.filter(item => item !== value) };
      }
    });
  };

  const handleMainImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setMainImage(compressedFile);
      } catch (error) {
        console.error("Error compressing main image:", error);
        setMainImage(file);
      }
    }
    e.target.value = null;
  };

  const handleSubImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxSubImages = 4;
    const totalSubImages = existingSubImages.length + subImages.length + files.length;

    if (totalSubImages > maxSubImages) {
      toast.info(`Maximum ${maxSubImages} sub-images allowed.`);
      e.target.value = null;
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          return await imageCompression(file, options);
        } catch (error) {
          console.error("Error compressing sub image:", error);
          return file;
        }
      })
    );

    setSubImages((prev) => [...prev, ...compressedFiles]);
    e.target.value = null;
  };

  const removeMainImage = () => {
    setMainImage(null);
    setExistingMainImage(null);
  };

  const removeNewSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingSubImage = (imageId) => {
    setExistingSubImages((prev) =>
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
    
    formDataToSend.append("weight", JSON.stringify({ value: formData.weightValue, unit: formData.weightUnit }));
    formDataToSend.append("dimensions", JSON.stringify({ length: formData.dimLength, width: formData.dimWidth, height: formData.dimHeight, unit: formData.dimUnit }));

    formData.occasions.forEach(occ => formDataToSend.append("occasions", occ));
    formData.relationships.forEach(rel => formDataToSend.append("relationships", rel));

    // Append new images
    if (mainImage) {
      formDataToSend.append("mainImage", mainImage);
    }
    subImages.forEach((image) => {
      formDataToSend.append("subImages", image);
    });

    // Append existing images to keep (edit mode only)
    if (isEditMode) {
      if (existingMainImage) {
        formDataToSend.append("retainedImages", existingMainImage._id || existingMainImage.public_id || existingMainImage.publicId);
      }
      existingSubImages.forEach((img) => {
        formDataToSend.append("retainedImages", img._id || img.public_id || img.publicId);
      });
    }

    try {
      let response;
      if (isEditMode) {
        // Independent PUT call for update
        response = await axios.put(
          `${API_BASE_URL}/products/${activeId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${
                (typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null) || ""
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
                (typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null) || ""
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
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/products");
        }
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
    <div className={embedded ? "w-full" : "max-w-5xl mx-auto p-3 sm:p-6"}>
      {!embedded && (
        <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 border-b border-stone-200">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="p-2 text-stone-600 hover:text-[#12343b] hover:bg-stone-100 rounded-xl transition active:scale-95"
            aria-label="Back to products"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#12343b] font-serif leading-tight">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              {isEditMode ? "Update product details, media, and inventory" : "Create a new artisan product listing"}
            </p>
          </div>
        </div>
      )}

      {loadingProduct ? (
        <div className="text-center py-12">
          <LogoLoader label="Loading product..." compact />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium text-sm">{error}</div>
      ) : (
        <div className={embedded ? "bg-white" : "bg-white p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-stone-200/80"}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Section 1: Basic Information */}
            <div className="bg-stone-50/60 p-3 sm:p-5 rounded-2xl border border-stone-200/60">
              <h4 className="text-xs sm:text-sm font-bold text-[#12343b] font-serif uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📋</span> Essential Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Handcrafted Resin Agate Coaster"
                    className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all placeholder:text-stone-400"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Available inventory"
                    className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  {loadingCategories ? (
                    <p className="text-xs text-stone-500">Loading categories...</p>
                  ) : (
                    <Select
                      name="category"
                      value={productCategories.map(cat => ({ value: cat._id, label: cat.name })).find(opt => opt.value === formData.category) || null}
                      onChange={(selectedOption) => setFormData(prev => ({ ...prev, category: selectedOption ? selectedOption.value : "" }))}
                      options={productCategories.map(cat => ({ value: cat._id, label: cat.name }))}
                      className="basic-single text-xs sm:text-sm"
                      classNamePrefix="select"
                      placeholder="Select category"
                      isClearable
                      required
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">
                    Featured Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
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
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#12343b]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12343b]"></div>
                    </label>
                    <span className="text-xs font-semibold text-stone-600">
                      {formData.isFeatured ? "✨ Featured on Homepage" : "Standard Listing"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Gifting Attributes */}
            <div className="bg-stone-50/60 p-3 sm:p-5 rounded-2xl border border-stone-200/60">
              <h4 className="text-xs sm:text-sm font-bold text-[#12343b] font-serif uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>🎁</span> Gifting Tags & Occasions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">Occasions</label>
                  <Select
                    isMulti
                    name="occasions"
                    value={occasionCategories.filter(cat => formData.occasions.includes(cat._id)).map(cat => ({ value: cat._id, label: cat.name }))}
                    onChange={(selectedOptions) => setFormData(prev => ({ ...prev, occasions: selectedOptions ? selectedOptions.map(opt => opt.value) : [] }))}
                    options={occasionCategories.map(cat => ({ value: cat._id, label: cat.name }))}
                    className="basic-multi-select text-xs sm:text-sm"
                    classNamePrefix="select"
                    placeholder="Select occasions..."
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">Relationships</label>
                  <Select
                    isMulti
                    name="relationships"
                    value={relationshipCategories.filter(cat => formData.relationships.includes(cat._id)).map(cat => ({ value: cat._id, label: cat.name }))}
                    onChange={(selectedOptions) => setFormData(prev => ({ ...prev, relationships: selectedOptions ? selectedOptions.map(opt => opt.value) : [] }))}
                    options={relationshipCategories.map(cat => ({ value: cat._id, label: cat.name }))}
                    className="basic-multi-select text-xs sm:text-sm"
                    classNamePrefix="select"
                    placeholder="Select relationships..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Physical Dimensions */}
            <div className="bg-stone-50/60 p-3 sm:p-5 rounded-2xl border border-stone-200/60">
              <h4 className="text-xs sm:text-sm font-bold text-[#12343b] font-serif uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>📦</span> Weight & Dimensions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">Weight</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      name="weightValue" 
                      value={formData.weightValue} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.01" 
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all" 
                      placeholder="e.g. 1.5" 
                    />
                    <select 
                      name="weightUnit" 
                      value={formData.weightUnit} 
                      onChange={handleInputChange} 
                      className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all cursor-pointer font-bold text-stone-700"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-xs sm:text-sm font-bold text-stone-700">Dimensions (L x W x H)</label>
                  <div className="flex gap-1.5 sm:gap-2">
                    <input 
                      type="number" 
                      name="dimLength" 
                      value={formData.dimLength} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.1" 
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all text-center" 
                      placeholder="L" 
                    />
                    <input 
                      type="number" 
                      name="dimWidth" 
                      value={formData.dimWidth} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.1" 
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all text-center" 
                      placeholder="W" 
                    />
                    <input 
                      type="number" 
                      name="dimHeight" 
                      value={formData.dimHeight} 
                      onChange={handleInputChange} 
                      min="0" 
                      step="0.1" 
                      className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all text-center" 
                      placeholder="H" 
                    />
                    <select 
                      name="dimUnit" 
                      value={formData.dimUnit} 
                      onChange={handleInputChange} 
                      className="px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white focus:border-[#12343b] focus:ring-2 focus:ring-[#12343b]/10 outline-none transition-all cursor-pointer font-bold text-stone-700"
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Description */}
            <div className="bg-stone-50/60 p-3 sm:p-5 rounded-2xl border border-stone-200/60">
              <h4 className="text-xs sm:text-sm font-bold text-[#12343b] font-serif uppercase tracking-wider mb-2 flex items-center gap-2">
                <span>✍️</span> Description & Artisan Story
              </h4>
              <div className="bg-white rounded-xl overflow-hidden border border-stone-200">
                <ReactQuill 
                  theme="snow" 
                  value={formData.description} 
                  onChange={(value) => setFormData(prev => ({...prev, description: value}))}
                  className="h-44 sm:h-56 mb-12 sm:mb-14"
                />
              </div>
            </div>

            {/* Section 5: Media & Imagery */}
            <div className="bg-stone-50/60 p-3 sm:p-5 rounded-2xl border border-stone-200/60 space-y-4">
              <h4 className="text-xs sm:text-sm font-bold text-[#12343b] font-serif uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> Media & Product Photos
              </h4>

              {/* Main Image Upload */}
              <div>
                <label className="block mb-1.5 text-xs sm:text-sm font-bold text-stone-700">
                  Main Photo (Primary Showcase) <span className="text-red-500">*</span>
                </label>

                {(mainImage || existingMainImage) ? (
                  <div className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-[#12343b]/30 shadow-md">
                    <img
                      src={mainImage ? URL.createObjectURL(mainImage) : getImageUrl(existingMainImage)}
                      alt="Main product"
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-300"
                      onClick={() => setPreviewImage(mainImage ? URL.createObjectURL(mainImage) : getImageUrl(existingMainImage))}
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg active:scale-95 transition"
                      title="Remove Main Image"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-1.5 left-1.5 bg-[#12343b] text-[#e1b382] font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
                      Primary
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-300 hover:border-[#12343b]/40 p-4 sm:p-6 rounded-2xl text-center bg-white hover:bg-stone-50 transition relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      required={!isEditMode}
                    />
                    <div className="text-stone-600 text-xs sm:text-sm flex flex-col items-center gap-1">
                      <span className="text-2xl">🖼️</span>
                      <span className="font-semibold text-stone-700">Tap to upload primary image</span>
                      <span className="text-[10px] text-stone-400">JPEG, PNG, WebP up to 5MB</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub Images Upload */}
              <div className="pt-2 border-t border-stone-200">
                <label className="block mb-1.5 text-xs sm:text-sm font-bold text-stone-700">
                  Additional Photos (Gallery Angle Views)
                </label>
                
                <div className="border-2 border-dashed border-stone-300 hover:border-[#12343b]/40 p-3 sm:p-4 rounded-2xl text-center bg-white hover:bg-stone-50 transition relative mb-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSubImagesChange}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                  <div className="text-stone-600 text-xs flex flex-col items-center gap-0.5">
                    <span className="font-semibold text-stone-700">Add up to 4 more photos</span>
                    <span className="text-[10px] text-stone-400">Tap to browse additional shots</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                  {/* Existing Sub Images */}
                  {isEditMode && existingSubImages.map((img) => (
                    <div key={getImageId(img)} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                      <img
                        src={getImageUrl(img)}
                        alt="Sub product"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                        onClick={() => setPreviewImage(getImageUrl(img))}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingSubImage(getImageId(img))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md active:scale-95"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* New Sub Image Previews */}
                  {subImages.map((file, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 shadow-xs">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                        onClick={() => setPreviewImage(URL.createObjectURL(file))}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewSubImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md active:scale-95"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="text-red-600 text-xs sm:text-sm font-semibold text-center">{error}</p>}

            {/* Mobile-Friendly Sticky Footer */}
            <div className="sticky bottom-0 -mx-3 -mb-4 sm:-mx-6 sm:-mb-4 px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white/95 backdrop-blur-md border-t border-stone-200 z-30 flex items-center justify-end gap-2 sm:gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    router.push("/admin/products");
                  }
                }}
                className="flex-1 sm:flex-initial min-h-[42px] px-5 py-2 text-xs sm:text-sm font-bold text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-100 transition active:scale-95 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || loadingProduct}
                className="flex-1 sm:flex-initial min-h-[42px] px-6 py-2 text-xs sm:text-sm font-bold text-[#e1b382] bg-[#12343b] hover:bg-[#0e272d] border border-[#e1b382]/30 rounded-xl shadow-md disabled:opacity-50 transition active:scale-95 flex items-center justify-center gap-2"
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

      {/* Image Preview Modal */}
      <Dialog 
        header="Image Preview" 
        visible={!!previewImage} 
        style={{ width: '92vw', maxWidth: '600px' }} 
        onHide={() => setPreviewImage(null)} 
        dismissableMask
        className="rounded-2xl overflow-hidden"
      >
        <div className="flex justify-center p-2 bg-stone-50 rounded-xl">
          <img src={previewImage} alt="Preview" className="max-w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-sm" />
        </div>
      </Dialog>
    </div>
  );
}
