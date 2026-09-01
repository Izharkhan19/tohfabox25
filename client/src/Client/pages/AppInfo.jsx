import React from 'react';
import { Link } from 'react-router-dom';

const AppInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Tohfabox Admin Portal</h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          This is the internal administration portal for the Tohfabox e-commerce store.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-left mb-10 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Purpose</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The <strong>Tohfabox Admin Portal</strong> requires access to the Google Drive API strictly to manage our store's inventory. 
          </p>
          <p className="text-gray-700 leading-relaxed">
            When our store administrators add a new product to the catalog, the product image is automatically uploaded to a dedicated, internal Google Drive folder using the Google Drive API. This allows us to securely host our product images and serve them to our customers on the public storefront. We do not access, view, or modify any user's personal Google Drive files.
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <Link to="/privacy-policy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>
          <span className="text-gray-300">|</span>
          <Link to="/terms-of-service" className="text-blue-600 font-bold hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;
