// import { useState, useEffect } from "react";
// import Header from "./components/Header/Header";
// import HeroSection from "./components/HeroSection";
// import FilterSection from "./components/FilterSection";
// import PhotoManager from "./components/pages/PhotoManager";
// import VideoManager from "./components/pages/VideoManager";
// import "./App.css"; // Ensure your App.css contains the PWA prompt styles

// // --- Custom Hook for PWA Update Prompt ---
// function usePWAUpdatePrompt() {
//   const [needsUpdate, setNeedsUpdate] = useState(false);
//   // Correct type for updateSW: a function that returns a Promise<void> or null
//   const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

//   useEffect(() => {
//     // Only attempt to register and check for updates in production
//     // and if Service Workers are supported by the browser.
//     if ("serviceWorker" in navigator && import.meta.env.PROD) {
//       window.addEventListener("load", () => {
//         navigator.serviceWorker
//           .register("/sw.js")
//           .then((registration) => {
//             console.log(
//               "Service Worker registered successfully:",
//               registration.scope
//             );

//             // Listen for updates on the registration
//             registration.onupdatefound = () => {
//               const installingWorker = registration.installing;
//               if (installingWorker == null) return;

//               installingWorker.onstatechange = () => {
//                 if (installingWorker.state === "installed") {
//                   if (navigator.serviceWorker.controller) {
//                     // New content is available and waiting to be activated
//                     setNeedsUpdate(true);
//                     // FIX IS HERE: Make the function passed to setUpdateSW an async function.
//                     // An async function implicitly returns a Promise<void>, satisfying the type.
//                     setUpdateSW(() => async () => {
//                       if (installingWorker) {
//                         installingWorker.postMessage({ type: "SKIP_WAITING" });
//                       }
//                       // Wait a moment for the new SW to take over, then reload.
//                       // Using await with setTimeout inside an async function is clean.
//                       await new Promise((resolve) => setTimeout(resolve, 50));
//                       window.location.reload();
//                     });
//                     console.log("New content available, please refresh.");
//                   } else {
//                     // Content is cached for offline use, first visit
//                     console.log("Content cached for offline use.");
//                   }
//                 }
//               };
//             };
//           })
//           .catch((error) => {
//             console.error("Service Worker registration failed:", error);
//           });
//       });
//     }
//   }, []); // Empty dependency array means this effect runs once on mount

//   const handleUpdate = () => {
//     if (updateSW) {
//       updateSW(); // This will now correctly call the async function
//     }
//   };

//   return { needsUpdate, handleUpdate };
// }

// // --- Main App Component ---
// function App() {
//   const [contentType, setContentType] = useState<"Photos" | "Videos" | "Users">(
//     "Photos"
//   );
//   const { needsUpdate, handleUpdate } = usePWAUpdatePrompt(); // Use the custom hook

//   return (
//     <>
//       {/* Header component with search functionality */}
//       <Header onSearch={(term) => console.log("Search:", term)} />

//       <main>
//         {/* Hero section */}
//         <HeroSection />

//         {/* Filter section to switch between content types */}
//         <FilterSection onContentTypeChange={setContentType} />

//         {/* Conditionally render content managers based on selected type */}
//         {contentType === "Photos" && <PhotoManager />}
//         {contentType === "Videos" && <VideoManager />}
//         {/* If you add a "Users" tab, you'd render a UserManager component here */}
//       </main>

//       {/* PWA Update Prompt */}
//       {needsUpdate && (
//         <div className="pwa-update-prompt">
//           <p>A new version is available! Refresh to get the latest updates.</p>
//           <button onClick={handleUpdate}>Update Now</button>
//         </div>
//       )}
//     </>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout/Layout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right" // Where the toasts will appear
        autoClose={3000} // How long toasts will be visible (in ms)
        hideProgressBar={false} // Show/hide progress bar
        newestOnTop={false} // Show new toasts on top of older ones
        closeOnClick // Close toast on click
        rtl={false} // Right-to-left support
        pauseOnFocusLoss // Pause timer when window loses focus
        draggable // Allow dragging toasts to dismiss
        pauseOnHover // Pause timer when hovering over toast
        theme="light" // 'light', 'dark', 'colored'
      />
      <Router>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
