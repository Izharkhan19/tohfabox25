import { useEffect, useState } from "react";
import {
  fetchVideos,
  deleteMedia,
  uploadMedia,
} from "../APIServices/cloudinaryAPI";
import UploadedVideosList from "../UploadedVideosList";
import { Button, Container, Spinner } from "react-bootstrap";
import type { UploadedItem } from "../../types/types";
import UploadModal from "../Models/UploadModal";
import "./CommonManager.css";
import { checkIsAdminUser } from "../Common/CommonServices";
import { ErrorToast, SuccessToast } from "../Common/toastUtils";
import { DeleteConfirmation } from "../Common/AlertPopup";

const VideoManager = () => {
  const [videos, setVideos] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err: any) {
      ErrorToast(err?.response?.data?.message);
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    let isDelete: any = await DeleteConfirmation();
    if (isDelete) {
      try {
        setLoading(true);
        let response: any = await deleteMedia(publicId, "video");
        loadVideos();
        SuccessToast(response?.data?.message);
        // setVideos((prev: any) =>
        //   prev.filter((item: any) => item.publicId !== publicId)
        // );
      } catch (err) {
        console.error("Failed to delete video", err);
        setLoading(false);
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const uploaded = await uploadMedia(file);
      SuccessToast(uploaded?.data?.message);
      loadVideos();
      // setVideos((prev: any) => [uploaded, ...prev]);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      ErrorToast("Upload failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <Container className="my-4 video-manager-container">
      <div className="video-manager-header">
        <h4 className="mb-0">Video Library 🎬 : ({videos?.length})</h4>{" "}
        {checkIsAdminUser() && (
          <Button onClick={() => setIsUploadModalOpen(true)}>
            Upload New Video
          </Button>
        )}
      </div>
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" />
          <p className="mt-2">Fetching your delightful videos...</p>{" "}
        </div>
      ) : (
        <UploadedVideosList items={videos} onDelete={handleDelete} />
      )}
      {isUploadModalOpen && (
        <UploadModal
          mode="video"
          onClose={() => {
            setIsUploadModalOpen(false);
          }}
          onFileUpload={handleUpload}
        />
      )}
    </Container>
  );
};

export default VideoManager;
