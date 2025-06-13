import React from "react";
import "./UploadedContent.css";

// Cloudinary-style response interface
interface UploadedItem {
  publicId: string;
  resourceType: string; // 'video'
  url: string; // Cloudinary secure URL
  bytes?: number;
  format?: string;
  createdAt: string; // ISO string
}

interface UploadedVideosListProps {
  items: UploadedItem[];
  onDelete: (publicId: string) => void;
}

const NoUploadsMessage: React.FC<{ type: string }> = ({ type }) => (
  <div className="no-uploads-message">
    <span>🎥</span>
    <p>No {type} uploaded yet!</p>
    <p>Use the "Upload {type.slice(0, -1)}" button to add your content.</p>
  </div>
);

const UploadedVideosList: React.FC<UploadedVideosListProps> = ({
  items,
  onDelete,
}) => {
  if (items.length === 0) {
    return (
      <div className="uploaded-videos-section container my-5">
        <NoUploadsMessage type="Videos" />
      </div>
    );
  }

  return (
    <div className="uploaded-category uploaded-videos-section container my-5">
      <div className="uploaded-grid">
        {items.map((item, index) => (
          <div
            key={item.publicId}
            className="uploaded-item card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {item.url ? (
              <video controls className="card-img-top uploaded-thumbnail">
                <source
                  src={item.url}
                  type={item.format ? `video/${item.format}` : "video/mp4"}
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
              <h5 className="card-title">{item.publicId.split("/").pop()}</h5>
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
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  View Original
                </a>
              )}
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => onDelete(item.publicId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedVideosList;
