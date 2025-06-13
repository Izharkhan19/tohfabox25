import React, { useState, useRef, useEffect } from "react";
import "./FilterSection.css";

interface FilterSectionProps {
  onContentTypeChange: (type: "Photos" | "Videos") => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  onContentTypeChange,
}) => {
  const [activeTab, setActiveTab] = useState<"Photos" | "Videos">("Photos");

  const photoTabRef = useRef<HTMLButtonElement>(null);
  const videoTabRef = useRef<HTMLButtonElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const updateIndicator = () => {
      const activeRef = activeTab === "Photos" ? photoTabRef : videoTabRef;

      if (activeRef.current && tabsContainerRef.current) {
        const activeRect = activeRef.current.getBoundingClientRect();
        const containerRect = tabsContainerRef.current.getBoundingClientRect();

        setIndicatorStyle({
          "--active-tab-width": `${activeRect.width}px`,
          "--active-tab-left": `${activeRect.left - containerRect.left}px`,
        } as React.CSSProperties);
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  const handleTabClick = (tab: "Photos" | "Videos") => {
    setActiveTab(tab);
    onContentTypeChange(tab);
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
      </div>
    </section>
  );
};

export default FilterSection;
