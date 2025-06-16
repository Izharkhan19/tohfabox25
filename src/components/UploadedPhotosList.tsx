import React from "react";
import "./UploadedContent.css";
import { checkIsAdminUser } from "./Common/CommonServices";

// New interface matching Cloudinary-style backend response
interface UploadedItem {
  publicId: string; // Cloudinary public ID
  resourceType: string; // 'image' or 'video'
  url: string; // Cloudinary secure URL
  bytes?: number; // File size in bytes
  format?: string; // e.g., 'jpg', 'png'
  createdAt: string; // ISO timestamp string
}

interface UploadedPhotosListProps {
  items: UploadedItem[];
  onDelete: (publicId: string) => void;
}

// Reusable no-uploads message
const NoUploadsMessage: React.FC<{ type: string }> = ({ type }) => (
  <div className="no-uploads-message">
    <span>📸</span>
    <p>No {type} uploaded yet!</p>
    <p>Use the "Upload {type.slice(0, -1)}" button to add your content.</p>
  </div>
);

const UploadedPhotosList: React.FC<UploadedPhotosListProps> = ({
  items,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="uploaded-photos-section container my-5">
        <NoUploadsMessage type="Photos" />
      </div>
    );
  }

  return (
    <div className="uploaded-category uploaded-photos-section container my-5">
      <div className="uploaded-grid">
        {items.map((item, index) => (
          <div
            key={item.publicId}
            className="uploaded-item card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img
              src={item.url}
              alt={item.publicId}
              className="card-img-top uploaded-thumbnail"
              loading="lazy"
            />
            <div className="card-body">
              <h5 className="card-title">{item?.publicId?.split("/").pop()}</h5>
              <p className="card-text">
                Format: {item.format?.toUpperCase() || "N/A"}
                <br />
                Size:{" "}
                {item.bytes
                  ? (item.bytes / (1024 * 1024)).toFixed(2)
                  : "N/A"}{" "}
                MB
                <br />
                Uploaded: {new Date(item.createdAt).toLocaleString()}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary mt-2"
              >
                View Original
              </a>
              {checkIsAdminUser() && (
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => onDelete(item.publicId)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedPhotosList;
