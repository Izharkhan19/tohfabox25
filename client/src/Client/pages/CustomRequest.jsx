import React, { useState } from 'react';
import { createCustomRequest } from '../../api-services/apiService';
import imageCompression from 'browser-image-compression';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function CustomRequest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Custom Order',
    message: ''
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        setReferenceImage(compressedFile);
        setPreviewImage(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Compression error:", error);
        setReferenceImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('type', formData.type);
    submitData.append('message', formData.message);
    if (referenceImage) {
      submitData.append('referenceImage', referenceImage);
    }

    const res = await createCustomRequest(submitData);
    
    if (res?.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        type: 'Custom Order',
        message: ''
      });
      removeImage();
      toast.success(res.message || 'Request submitted successfully!');
    } else {
      toast.error(res.message || 'Failed to submit request.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-900 px-6 py-8 sm:p-10 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Custom Requests
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Have a unique idea or a specific inquiry? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        {/* Form Section */}
        <div className="px-6 py-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Type Selection */}
            <div>
              <label className="text-base font-medium text-gray-900">What are you looking for?</label>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`
                  relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none 
                  ${formData.type === 'Custom Order' ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300'}
                `}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="Custom Order" 
                    className="sr-only" 
                    checked={formData.type === 'Custom Order'}
                    onChange={handleChange}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">Custom Order</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">I have specific requirements for a product.</span>
                    </span>
                  </span>
                </label>

                <label className={`
                  relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none 
                  ${formData.type === 'Inquiry' ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300'}
                `}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="Inquiry" 
                    className="sr-only" 
                    checked={formData.type === 'Inquiry'}
                    onChange={handleChange}
                  />
                  <span className="flex flex-1">
                    <span className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900">General Inquiry</span>
                      <span className="mt-1 flex items-center text-sm text-gray-500">I have a question or need support.</span>
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              {/* Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="focus:ring-gray-900 focus:border-gray-900 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-3 border outline-none transition"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {formData.type === 'Custom Order' ? 'Requirements Details' : 'How can we help you?'}
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-gray-900 focus:border-gray-900 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 outline-none transition"
                    placeholder={formData.type === 'Custom Order' ? "Describe your custom product requirements in detail..." : "Write your inquiry here..."}
                  />
                </div>
              </div>

              {/* Reference Image */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reference Image (Optional)
                </label>
                <div className="mt-1">
                  {previewImage ? (
                    <div className="relative inline-block mt-2">
                      <img src={previewImage} alt="Reference Preview" className="w-48 h-48 object-cover rounded-xl border border-gray-200 shadow-sm" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md transition"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                      <div className="space-y-1 text-center pointer-events-none">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <span className="relative font-medium text-gray-900">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70"
              >
                {loading ? 'Submitting...' : (
                  <>
                    Submit Request
                    <PaperAirplaneIcon className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
