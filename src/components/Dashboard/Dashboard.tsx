import usePWAUpdatePrompt from "../../Hooks/usePWAUpdatePrompt";
import FilterSection from "../FilterSection";
import Header from "../Header/Header";
import HeroSection from "../HeroSection";

const Dashboard = () => {
  const { needsUpdate, handleUpdate } = usePWAUpdatePrompt();

  return (
    <div>
      <Header onSearch={(term) => console.log("Search:", term)} />
      <main>
        <HeroSection />
        <FilterSection />
      </main>

      {/* PWA Update Prompt */}
      {needsUpdate && (
        <div className="pwa-update-prompt">
          <p>A new version is available! Refresh to get the latest updates.</p>
          <button onClick={handleUpdate}>Update Now</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
