import { useEffect, useState } from "react";
import {
  fetchPhotos,
  deleteMedia,
  uploadMedia,
} from "../APIServices/cloudinaryAPI";
import UploadedPhotosList from "../UploadedPhotosList";
import { Button, Container, Spinner } from "react-bootstrap";
import UploadModal from "../Models/UploadModal";
import type { UploadedItem } from "../../types/types";
import "./CommonManager.css";
import { checkIsAdminUser } from "../Common/CommonServices";
import { ErrorToast, SuccessToast } from "../Common/toastUtils";
import { DeleteConfirmation } from "../Common/AlertPopup";

const PhotoManager = () => {
  const [photos, setPhotos] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (err: any) {
      ErrorToast(err?.response?.data?.message);
      console.error("Failed to load photos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    let isDelete: any = await DeleteConfirmation();
    if (isDelete) {
      try {
        setLoading(true);
        let response: any = await deleteMedia(publicId, "image");
        loadPhotos();
        SuccessToast(response?.data?.message);
        // setPhotos((prev) => prev.filter((item) => item.publicId !== publicId));
      } catch (err: any) {
        ErrorToast(err?.response?.data?.message);
        console.error("Failed to delete photo", err);
        setLoading(false);
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const uploaded = await uploadMedia(file);
      SuccessToast(uploaded?.data?.message);
      loadPhotos();
      // setPhotos((prev: any) => [uploaded, ...prev]);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      ErrorToast(err?.response?.data?.message);
      // console.error("Upload failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <Container className="my-4 video-manager-container">
      <div className="video-manager-header">
        <h4 className="mb-0">Photo's Library 📸 : ({photos?.length})</h4>{" "}
        {checkIsAdminUser() && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            Upload Photo
          </Button>
        )}
      </div>
      {uploadStatus && (
        <p
          className={`fw-bold ${
            uploadStatus.includes("failed") ? "text-danger" : "text-success"
          } text-center mt-3 mb-4`}
        >
          {uploadStatus}
        </p>
      )}
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" />
          <p className="mt-2">Gathering your beautiful photos...</p>{" "}
        </div>
      ) : (
        <UploadedPhotosList items={photos} onDelete={handleDelete} />
      )}
      {isUploadModalOpen && (
        <UploadModal
          mode="photo"
          onClose={() => {
            setIsUploadModalOpen(false);
            setUploadStatus("");
          }}
          onFileUpload={handleUpload}
        />
      )}
    </Container>
  );
};

export default PhotoManager;
