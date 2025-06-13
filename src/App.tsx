import { useState } from "react";
import Header from "./components/Header/Header";
import HeroSection from "./components/HeroSection";
import FilterSection from "./components/FilterSection";
import "./App.css";
import PhotoManager from "./components/pages/PhotoManager";
import VideoManager from "./components/pages/VideoManager";

function App() {
  const [contentType, setContentType] = useState<"Photos" | "Videos" | "Users">(
    "Photos"
  );

  return (
    <>
      <Header onSearch={(term) => console.log("Search:", term)} />
      <main>
        <HeroSection />
        <FilterSection onContentTypeChange={setContentType} />
        {contentType === "Photos" && <PhotoManager />}
        {contentType === "Videos" && <VideoManager />}
      </main>
    </>
  );
}

export default App;
