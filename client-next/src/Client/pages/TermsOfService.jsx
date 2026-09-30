"use client";
import React from 'react';
import Link from "next/link";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Agreement to Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Products and Services</h2>
            <p>We reserve the right to modify or discontinue any product or service without notice at any time. We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of our operating jurisdiction, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at tohfabox25@gmail.com.</p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-blue-600 hover:underline font-medium">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
