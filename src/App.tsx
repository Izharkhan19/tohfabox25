import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Row, Col, Card, Spinner } from "react-bootstrap"; // Added Spinner for loading
import UploadModal from "./components/UploadModal";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FilterSection from "./components/FilterSection";
import ImageGrid from "./components/ImageGrid";
import "./App.css";

// Define a type for your uploaded items for better type safety
// Adjusted to make `file` and `previewUrl` optional as they might not exist for fetched items
interface UploadedItem {
  id: string; // A unique ID for React keys (e.g., Cloudinary publicId)
  file?: File; // The original File object (only for newly uploaded, temporary)
  type: "photo" | "video"; // 'photo' or 'video' based on resourceType
  previewUrl?: string; // Local URL.createObjectURL for display (only for newly uploaded, temporary)
  uploadedAt: Date; // Timestamp of upload
  // Backend response details from Cloudinary
  publicId: string; // Cloudinary's public ID (required now)
  cloudinaryUrl: string; // Cloudinary's secure URL for the asset (required now)
  message?: string; // Message from the backend (optional)
  resourceType: string; // 'image' or 'video' from Cloudinary (required now)
  bytes?: number; // Size in bytes
  format?: string; // File format
}

function App() {
  const [contentType, setContentType] = useState<"Photos" | "Videos" | "Users">(
    "Photos"
  );
  const [sortOrder, setSortOrder] = useState<string>("popular");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<"photo" | "video" | null>(null);

  // State for newly uploaded content (local temporary storage before fetching all)
  const [newlyUploadedContent, setNewlyUploadedContent] = useState<
    UploadedItem[]
  >([]);
  // State for all fetched content from Cloudinary
  const [allCloudinaryMedia, setAllCloudinaryMedia] = useState<UploadedItem[]>(
    []
  );

  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [lastUploadedCloudinaryInfo, setLastUploadedCloudinaryInfo] = useState<
    any | null
  >(null);

  const [fetchStatus, setFetchStatus] = useState("idle"); // 'idle', 'loading', 'succeeded', 'failed'
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Function to fetch all media from the backend
  const fetchAllMedia = async () => {
    setFetchStatus("loading");
    setFetchError(null);
    try {
      // let URL = "http://localhost:2025/";
      let URL = "https://tohfabox25-backend.onrender.com/";
      const response = await axios.get(`${URL}media`);
      const fetchedItems: UploadedItem[] = response.data.media.map(
        (item: any) => ({
          id: item.publicId,
          type: item.resourceType === "image" ? "photo" : "video",
          uploadedAt: new Date(item.createdAt),
          publicId: item.publicId,
          cloudinaryUrl: item.url,
          resourceType: item.resourceType,
          bytes: item.bytes,
          format: item.format,
        })
      );
      setAllCloudinaryMedia(fetchedItems);
      setFetchStatus("succeeded");
    } catch (error: any) {
      console.error("Failed to fetch media:", error);
      setFetchError(
        `Failed to load media: ${error.message || "Unknown error"}`
      );
      setFetchStatus("failed");
    }
  };

  // Fetch media when the component mounts
  useEffect(() => {
    fetchAllMedia();
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = (term: string) => {
    console.log("Searching for:", term);
    setSearchTerm(term);
  };

  const handleContentTypeChange = (type: "Photos" | "Videos" | "Users") => {
    console.log("Content type changed to:", type);
    setContentType(type);
  };

  const handleSortChange = (order: string) => {
    console.log("Sort order changed to:", order);
    setSortOrder(order);
  };

  const handleFilterClick = () => {
    setUploadMessage(
      "Filters button clicked! (This would open a modal/sidebar in a full app)"
    );
  };

  const openUploadModal = (mode: "photo" | "video") => {
    setUploadMode(mode);
    setIsUploadModalOpen(true);
    setUploadStatus("");
    setUploadMessage("");
    setLastUploadedCloudinaryInfo(null);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadMode(null);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("media", file);

    setUploadStatus("Uploading...");
    setUploadMessage("");
    setLastUploadedCloudinaryInfo(null);

    try {
      // let URL: any = "http://localhost:2025/";
      let URL = "https://tohfabox25-backend.onrender.com/";
      const response = await axios.post(`${URL}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadStatus(`Uploading: ${percentCompleted}%`);
        },
      });

      const {
        message: backendMessage,
        url,
        publicId,
        resourceType,
        bytes,
        format,
      } = response.data;

      const newUploadedItem: UploadedItem = {
        id: publicId,
        file: file, // Keep the original File object for temporary local use if needed
        type: resourceType === "image" ? "photo" : "video",
        previewUrl: URL.createObjectURL(file), // Local URL for immediate preview
        uploadedAt: new Date(),
        publicId: publicId,
        cloudinaryUrl: url,
        message: backendMessage,
        resourceType: resourceType,
        bytes: bytes,
        format: format,
      };

      setUploadMessage(backendMessage || "File uploaded successfully!");
      setLastUploadedCloudinaryInfo(response.data);
      setNewlyUploadedContent((prevContent) => [
        newUploadedItem,
        ...prevContent,
      ]); // Add to temporary new uploads

      // Re-fetch all media after a successful upload to ensure the ImageGrid is updated with the new item
      await fetchAllMedia();
      setUploadStatus("Upload Complete!"); // Set status after re-fetch completes
      console.log("Upload successful:", response.data);
    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setUploadMessage(`Upload failed: ${errorMessage}`);
      setUploadStatus("Upload Failed!");
    } finally {
      // The modal (`UploadModal`) handles its own closing via `onClose` prop after `onFileUpload`
    }
  };

  // Combine newly uploaded content and all fetched content for display
  // Filter and pass to ImageGrid
  // const combinedMedia = [...newlyUploadedContent, ...allCloudinaryMedia];
  const combinedMedia = [...allCloudinaryMedia];

  const photosForGrid: any = combinedMedia.filter(
    (item) => item.type === "photo" && item.cloudinaryUrl
  );
  const videosForGrid: any = combinedMedia.filter(
    (item) => item.type === "video" && item.cloudinaryUrl
  );

  return (
    <>
      <Header onSearch={handleSearch} />
      <main>
        <HeroSection />
        <FilterSection
          onContentTypeChange={handleContentTypeChange}
          onSortChange={handleSortChange}
          onFilterClick={handleFilterClick}
          onUploadPhotoClick={() => openUploadModal("photo")}
          onUploadVideoClick={() => openUploadModal("video")}
        />

        {/* Display general upload status/message */}
        <Container className="my-3">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              {uploadStatus && (
                <p
                  className={`mt-2 fw-bold ${
                    uploadStatus.includes("Failed")
                      ? "text-danger"
                      : "text-primary"
                  }`}
                >
                  {uploadStatus}
                </p>
              )}
              {uploadMessage && (
                <p
                  className={`fw-bold ${
                    uploadStatus.includes("Failed")
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}

              {/* Display details of the very last successful upload for quick confirmation */}
              {lastUploadedCloudinaryInfo &&
                lastUploadedCloudinaryInfo.url &&
                uploadStatus === "Upload Complete!" && (
                  <Card className="mt-4 p-3 shadow-sm text-start bg-light">
                    <Card.Title>
                      <h5>Last Uploaded Media:</h5>
                    </Card.Title>
                    <p>
                      <strong>Public ID:</strong>{" "}
                      {lastUploadedCloudinaryInfo.publicId}
                    </p>
                    <p>
                      <strong>URL:</strong>{" "}
                      <a
                        href={lastUploadedCloudinaryInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {lastUploadedCloudinaryInfo.url}
                      </a>
                    </p>
                    {lastUploadedCloudinaryInfo.resourceType === "image" && (
                      <img
                        src={lastUploadedCloudinaryInfo.url}
                        alt="Last Uploaded"
                        className="img-fluid rounded"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "150px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    {lastUploadedCloudinaryInfo.resourceType === "video" && (
                      <video
                        src={lastUploadedCloudinaryInfo.url}
                        controls
                        className="img-fluid rounded"
                        style={{ maxWidth: "300px", maxHeight: "200px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </Card>
                )}
            </Col>
          </Row>
        </Container>

        {/* Display fetch status and error */}
        {fetchStatus === "loading" && (
          <Container className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading media...</span>
            </Spinner>
            <p className="mt-2">Loading photos and videos...</p>
          </Container>
        )}
        {fetchStatus === "failed" && (
          <Container className="text-center my-4">
            <p className="text-danger">Error: {fetchError}</p>
            <Button variant="danger" onClick={fetchAllMedia}>
              Retry Fetch
            </Button>
          </Container>
        )}
        {fetchStatus === "succeeded" &&
          allCloudinaryMedia.length === 0 &&
          newlyUploadedContent.length === 0 && (
            <Container className="text-center my-4">
              <p className="text-muted">
                No media uploaded yet. Start by uploading some photos or videos!
              </p>
            </Container>
          )}

        <ImageGrid
          contentType={contentType}
          sortOrder={sortOrder}
          searchTerm={searchTerm}
          // Pass the combined and filtered media to ImageGrid
          uploadedPhotos={photosForGrid}
          uploadedVideos={videosForGrid}
        />
      </main>
      {isUploadModalOpen && uploadMode && (
        <UploadModal
          onClose={closeUploadModal}
          onFileUpload={handleFileUpload}
          mode={uploadMode}
        />
      )}
    </>
  );
}

export default App;
