// import React, { useState } from "react";
// import "./FilterSection.css";
// import { Button } from "react-bootstrap";

// interface FilterSectionProps {
//   onContentTypeChange: (type: "Photos" | "Videos" | "Users") => void;
//   onSortChange: (sortOrder: string) => void;
//   onFilterClick: () => void;
//   onUploadPhotoClick: () => void;
//   onUploadVideoClick: () => void;
// }

// const FilterSection: React.FC<FilterSectionProps> = ({
//   onContentTypeChange,
//   onSortChange,
//   onFilterClick,
//   onUploadPhotoClick,
//   onUploadVideoClick,
// }) => {
//   const [activeTab, setActiveTab] = useState<"Photos" | "Videos" | "Users">(
//     "Photos"
//   );
//   const [sortOrder, setSortOrder] = useState<string>("popular");

//   const handleTabClick = (tab: "Photos" | "Videos" | "Users") => {
//     setActiveTab(tab);
//     onContentTypeChange(tab);
//   };

//   const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortOrder(event.target.value);
//     onSortChange(event.target.value);
//   };

//   return (
//     <section className="filter-section container">
//       <div className="content-tabs">
//         <button
//           className={`tab-button ${activeTab === "Photos" ? "active" : ""}`}
//           onClick={() => handleTabClick("Photos")}
//         >
//           Photos 30K
//         </button>
//         <button
//           className={`tab-button ${activeTab === "Videos" ? "active" : ""}`}
//           onClick={() => handleTabClick("Videos")}
//         >
//           Videos 4.5K
//         </button>
//         <button
//           className={`tab-button ${activeTab === "Users" ? "active" : ""}`}
//           onClick={() => handleTabClick("Users")}
//         >
//           Users 8K
//         </button>
//       </div>
//       <div className="filter-options">
//         <button className="filters-btn" onClick={onFilterClick}>
//           <span>Filters</span>
//           <span className="filter-icon">⚙️</span>
//         </button>
//         <select
//           className="sort-by-select"
//           value={sortOrder}
//           onChange={handleSortChange}
//         >
//           <option value="popular">Popular</option>
//           <option value="newest">Newest</option>
//         </select>
//       </div>
//       {/* Conditionally render Upload Buttons based on activeTab */}
//       <div className="upload-buttons-group">
//         {activeTab === "Photos" && (
//           <Button
//             variant="success"
//             onClick={onUploadPhotoClick}
//             className="upload-action-btn"
//           >
//             Upload Photo
//           </Button>
//         )}
//         {activeTab === "Videos" && (
//           <Button
//             variant="info"
//             onClick={onUploadVideoClick}
//             className="upload-action-btn"
//           >
//             Upload Video
//           </Button>
//         )}
//         {/* No upload button will be shown for 'Users' tab */}
//       </div>
//     </section>
//   );
// };

// export default FilterSection;

import React, { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import "./FilterSection.css";
import { Button } from "react-bootstrap";

interface FilterSectionProps {
  onContentTypeChange: (type: "Photos" | "Videos" | "Users") => void;
  onSortChange: (sortOrder: string) => void;
  onFilterClick: () => void;
  onUploadPhotoClick: () => void;
  onUploadVideoClick: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onContentTypeChange,
  onSortChange,
  onFilterClick,
  onUploadPhotoClick,
  onUploadVideoClick,
}) => {
  const [activeTab, setActiveTab] = useState<"Photos" | "Videos" | "Users">(
    "Photos"
  );
  const [sortOrder, setSortOrder] = useState<string>("popular");

  // Refs for each tab button to measure their dimensions and position
  const photoTabRef = useRef<HTMLButtonElement>(null);
  const videoTabRef = useRef<HTMLButtonElement>(null);
  const userTabRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // State to hold the dynamic CSS variables for the active tab indicator
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Effect to calculate and update indicator position and width
  useEffect(() => {
    const updateIndicator = () => {
      let activeRef: React.RefObject<HTMLButtonElement> | null = null;
      if (activeTab === "Photos") activeRef = photoTabRef;
      else if (activeTab === "Videos") activeRef = videoTabRef;
      else if (activeTab === "Users") activeRef = userTabRef;

      if (activeRef?.current && tabsContainerRef.current) {
        const activeRect = activeRef.current.getBoundingClientRect();
        const containerRect = tabsContainerRef.current.getBoundingClientRect();

        setIndicatorStyle({
          "--active-tab-width": `${activeRect.width}px`,
          "--active-tab-left": `${activeRect.left - containerRect.left}px`,
        });
      }
    };

    updateIndicator(); // Initial update
    window.addEventListener("resize", updateIndicator); // Update on resize

    return () => {
      window.removeEventListener("resize", updateIndicator); // Cleanup
    };
  }, [activeTab]); // Recalculate when activeTab changes

  const handleTabClick = (tab: "Photos" | "Videos" | "Users") => {
    setActiveTab(tab);
    onContentTypeChange(tab);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
    onSortChange(event.target.value);
  };

  return (
    <section className="filter-section container">
      <div
        className="content-tabs"
        ref={tabsContainerRef}
        style={indicatorStyle}
      >
        <button
          ref={photoTabRef}
          className={`tab-button ${activeTab === "Photos" ? "active" : ""}`}
          onClick={() => handleTabClick("Photos")}
        >
          Photos 30K
        </button>
        <button
          ref={videoTabRef}
          className={`tab-button ${activeTab === "Videos" ? "active" : ""}`}
          onClick={() => handleTabClick("Videos")}
        >
          Videos 4.5K
        </button>
        {/* <button
          ref={userTabRef}
          className={`tab-button ${activeTab === "Users" ? "active" : ""}`}
          onClick={() => handleTabClick("Users")}
        >
          Users 8K
        </button> */}
      </div>
      <div className="filter-options">
        {/* <button className="filters-btn" onClick={onFilterClick}>
          <span>Filters</span>
          <span className="filter-icon">⚙️</span>
        </button> */}
        {/* <select
          className="sort-by-select"
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
        </select> */}
      </div>
      <div className="upload-buttons-group">
        {activeTab === "Photos" && (
          <Button
            variant="success"
            onClick={onUploadPhotoClick}
            className="upload-action-btn"
          >
            Upload Photo
          </Button>
        )}
        {activeTab === "Videos" && (
          <Button
            variant="info"
            onClick={onUploadVideoClick}
            className="upload-action-btn"
          >
            Upload Video
          </Button>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
