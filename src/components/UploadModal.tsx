import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./UploadModal.css";

interface UploadModalProps {
  onClose: () => void;
  onFileUpload: (file: File) => void;
  mode: "photo" | "video"; // Now a required prop
}

const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onFileUpload,
  mode,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial file input acceptance based on mode
  const acceptedFileTypes = mode === "photo" ? "image/*" : "video/*";
  const modalTitle = mode === "photo" ? "Upload Photo" : "Upload Video";
  const sectionHeading =
    mode === "photo" ? "Upload your image" : "Upload your video";
  const dropAreaText =
    mode === "photo"
      ? "Drag & drop an image here, or click to browse"
      : "Drag & drop a video here, or click to browse";
  const uploadButtonText = mode === "photo" ? "Upload Image" : "Upload Video";

  useEffect(() => {
    // Cleanup preview URL when component unmounts or file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset states when modal is opened or mode changes (if it could change internally)
  // This useEffect ensures a clean state if the modal component remounts or 'mode' changes
  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  }, [mode]); // Dependency on 'mode' ensures reset if mode changes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Clean up previous preview
    }

    if (file) {
      // Validate based on the current 'mode' prop
      if (mode === "photo" && file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else if (mode === "video" && file.type.startsWith("video/")) {
        setPreviewUrl(null); // No direct preview for video files in this modal
      } else {
        alert(`Please select a valid ${mode} file.`); // Replaced with a more robust message box if preferred
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          // Reset file input
          fileInputRef.current.value = "";
        }
      }
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      // Final validation before "upload"
      if (mode === "photo" && !selectedFile.type.startsWith("image/")) {
        alert(
          // Replaced with a more robust message box if preferred
          "Selected file is not an image. Please select an image for photo upload."
        );
        return;
      }
      if (mode === "video" && !selectedFile.type.startsWith("video/")) {
        alert(
          // Replaced with a more robust message box if preferred
          "Selected file is not a video. Please select a video for video upload."
        );
        return;
      }

      onFileUpload(selectedFile);
      // Reset state after "upload" and close modal
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose(); // Close modal after successful "upload"
    } else {
      alert("Please select a file to upload."); // Replaced with a more robust message box if preferred
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] || null;

    if (file) {
      // Validate based on the current 'mode' prop
      if (mode === "photo" && file.type.startsWith("image/")) {
        setSelectedFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
      } else if (mode === "video" && file.type.startsWith("video/")) {
        setSelectedFile(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null); // No direct preview for video
      } else {
        alert(`Dropped file is not a valid ${mode}.`); // Replaced with a more robust message box if preferred
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCloseModal = () => {
    // Reset state when modal is closed
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Modal show={true} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="upload-section">
          <h4>{sectionHeading}</h4>
          <div
            className="drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            {mode === "photo" && previewUrl ? (
              <img
                src={previewUrl}
                alt="File Preview"
                className="file-preview img-fluid"
              />
            ) : selectedFile ? (
              <p>Selected: {selectedFile.name}</p>
            ) : (
              <p>{dropAreaText}</p>
            )}
            <Form.Control
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </div>

          {selectedFile && (
            <>
              <div className="file-details mt-3">
                <p>
                  <strong>File Name:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>File Type:</strong> {selectedFile.type}
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleUploadClick}
                disabled={!selectedFile}
                className="mt-3 upload-confirm-btn-inline"
              >
                {uploadButtonText}
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
