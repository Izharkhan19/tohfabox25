import React from "react";
import "./UploadedContent.css";

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

interface UploadedVideosListProps {
  items: UploadedItem[];
}

// Separate component for "No Uploads" message for reusability
const NoUploadsMessage: React.FC<{ type: string }> = ({ type }) => (
  <div className="no-uploads-message">
    <span>🎥</span> {/* Specific emoji for videos */}
    <p>No {type} uploaded yet!</p>
    <p>Use the "Upload {type.slice(0, -1)}" button to add your content.</p>
  </div>
);

const UploadedVideosList: React.FC<UploadedVideosListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="uploaded-videos-section container my-5">
        <NoUploadsMessage type="Videos" />
      </div>
    );
  }

  return (
    <div className="uploaded-category uploaded-videos-section container my-5">
      <h3>Product Video's Collection</h3>
      <div className="uploaded-grid">
        {items.map((item, index) => {
          if (item.resourceType === "video") {
            console.log(`Video item ${item.publicId}:`);
            console.log(`  URL: ${item.cloudinaryUrl}`);
            console.log(`  Format: ${item.format}`);
            console.log(`  Type attribute: video/${item.format}`);
          }

          return (
            <div
              key={item.id}
              className="uploaded-item card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Ensure cloudinaryUrl exists before attempting to render video */}
              {item.cloudinaryUrl ? (
                <video
                  controls
                  className="card-img-top uploaded-thumbnail"
                  loading="lazy"
                >
                  <source
                    src={item.cloudinaryUrl}
                    type={item.format ? `video/${item.format}` : undefined}
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-light text-muted"
                  style={{ height: "150px" }}
                >
                  Video URL missing or processing.
                </div>
              )}

              <div className="card-body">
                {/* Display publicId or derive a more readable name.
                    .split('/').pop() extracts the actual filename part from a publicId like 'uploads/videos/my_video'. */}
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
                {/* Add a button to view the original video directly on Cloudinary's CDN */}
                {item.cloudinaryUrl && (
                  <a
                    href={item.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary mt-2"
                  >
                    View Original
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UploadedVideosList;
