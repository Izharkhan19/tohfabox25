import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
          <p className="font-semibold text-gray-800">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <p>Tohfabox ("we," "us," or "our") operates the Tohfabox website. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
              <li><strong>Usage Data:</strong> We may also collect information how the Service is accessed and used ("Usage Data").</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Google API Services User Data Policy</h2>
            <p>Tohfabox's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Data Accessed:</strong> Our application accesses your Google Drive strictly for the purpose of uploading and managing product images for the store's inventory system.</li>
              <li><strong>Data Use:</strong> We use the Google Drive API solely to upload media files and retrieve public view links for those files to display products on our storefront.</li>
              <li><strong>Data Storage:</strong> We do not store your personal Google Drive data, files, or folder contents on our servers, other than the direct public URLs generated for the specific product images uploaded through our admin panel.</li>
              <li><strong>Data Sharing:</strong> We do not share, sell, or distribute your Google user data to any third parties. Access to the Google Drive folder is strictly limited to authorized store administrators.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Security of Data</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us by email: support@tohfabox25.com</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link to="/" className="text-blue-600 hover:underline font-medium">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
