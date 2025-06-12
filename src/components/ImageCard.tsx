import React, { useEffect, useState } from "react";
import "./ImageGrid.css";
import UploadedPhotosList from "./UploadedPhotosList"; // Import the photo list component
import UploadedVideosList from "./UploadedVideosList"; // Import the video list component

// Re-use UploadedItem interface from App.tsx or a shared types file
interface UploadedItem {
  id: string;
  file: File;
  type: "photo" | "video";
  previewUrl: string;
  uploadedAt: Date;
}

interface ImageGridProps {
  contentType: "Photos" | "Videos" | "Users";
  sortOrder: string;
  searchTerm: string;
  uploadedPhotos: UploadedItem[]; // New prop for uploaded photos
  uploadedVideos: UploadedItem[]; // New prop for uploaded videos
}

const ImageGrid: React.FC<ImageGridProps> = ({
  contentType,
  sortOrder,
  searchTerm,
  uploadedPhotos, // Destructure new props
  uploadedVideos,
}: any) => {
  const [data, setData] = useState<any[]>([]); // This will store fetched data

  // Simulate fetching data based on contentType, sortOrder, searchTerm
  useEffect(() => {
    // In a real app, you would make an API call here.
    // For now, we'll simulate data based on content type.
    const fetchData = async () => {
      console.log(
        `Fetching data for: ${contentType}, Sort: ${sortOrder}, Search: ${searchTerm}`
      );
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let simulatedData: any[] = [];
      if (contentType === "Photos") {
        simulatedData = [
          {
            id: "p1",
            src: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 1",
            artist: "Artist A",
          },
          {
            id: "p2",
            src: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 2",
            artist: "Artist B",
          },
          {
            id: "p3",
            src: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 3",
            artist: "Artist C",
          },
          {
            id: "p4",
            src: "https://images.pexels.com/photos/168938/pexels-photo-168938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 4",
            artist: "Artist D",
          },
          {
            id: "p5",
            src: "https://images.pexels.com/photos/176961/pexels-photo-176961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 5",
            artist: "Artist E",
          },
          {
            id: "p6",
            src: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            alt: "Photo 6",
            artist: "Artist F",
          },
        ];
      } else if (contentType === "Videos") {
        simulatedData = [
          {
            id: "v1",
            src: "https://www.pexels.com/videos/download/2020295/",
            alt: "Video 1",
            artist: "Video Artist A",
          },
          {
            id: "v2",
            src: "https://www.pexels.com/videos/download/2019918/",
            alt: "Video 2",
            artist: "Video Artist B",
          },
          {
            id: "v3",
            src: "https://www.pexels.com/videos/download/2020158/",
            alt: "Video 3",
            artist: "Video Artist C",
          },
          {
            id: "v4",
            src: "https://www.pexels.com/videos/download/2020087/",
            alt: "Video 4",
            artist: "Video Artist D",
          },
        ];
      } else if (contentType === "Users") {
        simulatedData = [
          {
            id: "u1",
            name: "John Doe",
            avatar:
              "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            followers: "1.2M",
          },
          {
            id: "u2",
            name: "Jane Smith",
            avatar:
              "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            followers: "800K",
          },
          {
            id: "u3",
            name: "Peter Jones",
            avatar:
              "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            followers: "500K",
          },
        ];
      }

      // Filter by search term
      if (searchTerm) {
        simulatedData = simulatedData.filter(
          (item) =>
            (item.alt &&
              item.alt.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.artist &&
              item.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.name &&
              item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Sort data (basic example)
      if (sortOrder === "newest") {
        simulatedData.reverse(); // Simple reverse for demo
      }

      setData(simulatedData);
    };

    fetchData();
  }, [contentType, sortOrder, searchTerm]);

  return (
    <section className="image-grid-section container my-5">
      {contentType === "Photos" && (
        <>
          {uploadedPhotos.length > 0 && (
            <UploadedPhotosList items={uploadedPhotos} />
          )}
          <div className="grid-header">
            <h2>Popular Free Photos</h2>
          </div>
          <div className="image-grid">
            {data.map((item) => (
              <div key={item.id} className="grid-item">
                <img src={item.src} alt={item.alt} />
                <div className="overlay">
                  <span className="artist-name">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {contentType === "Videos" && (
        <>
          {uploadedVideos.length > 0 && (
            <UploadedVideosList items={uploadedVideos} />
          )}
          <div className="grid-header">
            <h2>Popular Free Videos</h2>
          </div>
          <div className="image-grid">
            {data.map((item) => (
              <div key={item.id} className="grid-item video-item">
                <video controls>
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="overlay">
                  <span className="artist-name">{item.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {contentType === "Users" && (
        <div className="user-grid">
          <div className="grid-header">
            <h2>Popular Users</h2>
          </div>
          <div className="user-list">
            {data.map((user) => (
              <div key={user.id} className="user-card">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                />
                <h3 className="user-name">{user.name}</h3>
                <p className="user-followers">{user.followers} Followers</p>
                <button className="follow-btn">Follow</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageGrid;
