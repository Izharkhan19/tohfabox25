import { useEffect, useState } from "react";
import { fetchVideos, deleteMedia, uploadMedia } from "../APIServices/cloudinaryAPI";
import UploadedVideosList from "../UploadedVideosList";
import { Button, Container, Spinner } from "react-bootstrap";
import type { UploadedItem } from "../../types/types";
import UploadModal from "../Models/UploadModal";
import "./CommonManager.css";

const VideoManager = () => {
  const [videos, setVideos] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error("Failed to load videos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      setLoading(true);
      await deleteMedia(publicId, "video");
      loadVideos();
      // setVideos((prev: any) =>
      //   prev.filter((item: any) => item.publicId !== publicId)
      // );
    } catch (err) {
      console.error("Failed to delete video", err);
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      // const uploaded =
      await uploadMedia(file, "video");
      loadVideos();
      // setVideos((prev: any) => [uploaded, ...prev]);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      console.error("Upload failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <Container className="my-4 video-manager-container">
      <div className="video-manager-header">
        <h4 className="mb-0">Video Library 🎬</h4>{" "}
        <Button onClick={() => setIsUploadModalOpen(true)}>
          Upload New Video
        </Button>{" "}
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
