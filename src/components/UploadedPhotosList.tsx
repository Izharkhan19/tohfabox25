// import React, { useEffect } from 'react';
// import './UploadedContent.css'; // Import the shared CSS

// // Re-use the UploadedItem interface (assuming it's defined in App.tsx or a shared types file)
// interface UploadedItem {
//   id: string;
//   file: File;
//   type: 'photo' | 'video';
//   previewUrl: string;
//   uploadedAt: Date;
// }

// interface UploadedPhotosListProps {
//   items: UploadedItem[];
// }

// // Separate component for "No Uploads" message for reusability
// const NoUploadsMessage: React.FC<{ type: string }> = ({ type }) => (
//   <div className="no-uploads-message">
//     <span>📸</span> {/* Specific emoji for photos */}
//     <p>No {type} uploaded yet!</p>
//     <p>Use the "Upload {type.slice(0, -1)}" button to add your content.</p>
//   </div>
// );

// const UploadedPhotosList: React.FC<UploadedPhotosListProps> = ({ items }) => {

//   useEffect(() => {
//     // Clean up object URLs when component unmounts or items change
//     return () => {
//       items.forEach(item => {
//         URL.revokeObjectURL(item.previewUrl);
//       });
//     };
//   }, [items]);

//   if (items.length === 0) {
//     return (
//       <div className="uploaded-photos-section container my-5">
//         <NoUploadsMessage type="Photos" />
//       </div>
//     );
//   }

//   return (
//     <div className="uploaded-category uploaded-photos-section container my-5"> {/* Specific class for this section */}
//       <h3>Your Uploaded Photos</h3>
//       <div className="uploaded-grid">
//         {items.map((item, index) => (
//           <div key={item.id} className="uploaded-item card" style={{ animationDelay: `${index * 0.05}s` }}>
//             <img src={item.previewUrl} alt={item.file.name} className="card-img-top uploaded-thumbnail" loading="lazy" />
//             <div className="card-body">
//               <h5 className="card-title">{item.file.name}</h5>
//               <p className="card-text">
//                 Size: {(item.file.size / (1024 * 1024)).toFixed(2)} MB<br />
//                 Uploaded: {item.uploadedAt.toLocaleTimeString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UploadedPhotosList;

import React from "react";
import "./UploadedContent.css"; // Import the shared CSS

// Updated UploadedItem interface to reflect data from Cloudinary API response
interface UploadedItem {
  id: string; // Cloudinary publicId, used as unique key
  file?: File; // Optional: The original File object, only available for newly selected local files temporarily
  type: "photo" | "video"; // 'photo' or 'video'
  previewUrl?: string; // Optional: Local URL.createObjectURL for display (temporary local preview)
  uploadedAt: Date; // Timestamp of upload
  publicId: string; // Cloudinary's public ID (required for fetched items)
  cloudinaryUrl: string; // Cloudinary's secure URL for the asset (required for fetched items)
  bytes?: number; // Size in bytes from Cloudinary (optional, but expected for fetched items)
  format?: string; // File format from Cloudinary (optional, but expected for fetched items)
  resourceType: string; // 'image' or 'video' from Cloudinary (required for fetched items)
}

interface UploadedPhotosListProps {
  items: UploadedItem[];
}

// Separate component for "No Uploads" message for reusability
const NoUploadsMessage: React.FC<{ type: string }> = ({ type }) => (
  <div className="no-uploads-message">
    <span>📸</span> {/* Specific emoji for photos */}
    <p>No {type} uploaded yet!</p>
    <p>Use the "Upload {type.slice(0, -1)}" button to add your content.</p>
  </div>
);

const UploadedPhotosList: React.FC<UploadedPhotosListProps> = ({ items }) => {
  // IMPORTANT: The useEffect hook for URL.revokeObjectURL has been removed from here.
  // This cleanup is relevant for local `URL.createObjectURL`s, which are typically
  // handled by the component generating them (e.g., `App.js` for the temporary preview
  // of newly selected files, or the `UploadModal` itself if it keeps a preview).
  // For items fetched from Cloudinary, `item.cloudinaryUrl` is a remote URL and does not
  // require manual object URL revocation.

  if (items.length === 0) {
    return (
      <div className="uploaded-photos-section container my-5">
        <NoUploadsMessage type="Photos" />
      </div>
    );
  }

  return (
    <div className="uploaded-category uploaded-photos-section container my-5">
      {" "}
      {/* Specific class for this section */}
      <h3>Product Photo's Collection</h3>
      <div className="uploaded-grid">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="uploaded-item card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Use item.cloudinaryUrl for the image source. This is the direct URL from Cloudinary. */}
            <img
              src={item.cloudinaryUrl}
              alt={item.publicId}
              // {/* Use publicId as alt text for accessibility */}
              className="card-img-top uploaded-thumbnail"
              loading="lazy"
            />
            <div className="card-body">
              {/* Display publicId or derive a more readable name.
                  .split('/').pop() extracts the actual filename part from a publicId like 'uploads/images/my_photo'. */}
              <h5 className="card-title">{item.publicId.split("/").pop()}</h5>
              <p className="card-text">
                {/* Display size using item.bytes, converting to MB and handling cases where bytes might be undefined */}
                Size:{" "}
                {item.bytes ? (item.bytes / (1024 * 1024)).toFixed(2) : "N/A"}{" "}
                MB
                <br />
                {/* Display upload time in a user-friendly format */}
                Uploaded: {item.uploadedAt.toLocaleTimeString()}
              </p>
              {/* Add a button to view the original image directly on Cloudinary's CDN */}
              <a
                href={item.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary mt-2"
              >
                View Original
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedPhotosList;
