import { useEffect, useState } from "react";

// --- Custom Hook for PWA Update Prompt ---
export default function usePWAUpdatePrompt() {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  // Correct type for updateSW: a function that returns a Promise<void> or null
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Only attempt to register and check for updates in production
    // and if Service Workers are supported by the browser.
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registered successfully:",
              registration.scope
            );

            // Listen for updates on the registration
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) return;

              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // New content is available and waiting to be activated
                    setNeedsUpdate(true);
                    // FIX IS HERE: Make the function passed to setUpdateSW an async function.
                    // An async function implicitly returns a Promise<void>, satisfying the type.
                    setUpdateSW(() => async () => {
                      if (installingWorker) {
                        installingWorker.postMessage({ type: "SKIP_WAITING" });
                      }
                      // Wait a moment for the new SW to take over, then reload.
                      // Using await with setTimeout inside an async function is clean.
                      await new Promise((resolve) => setTimeout(resolve, 50));
                      window.location.reload();
                    });
                    console.log("New content available, please refresh.");
                  } else {
                    // Content is cached for offline use, first visit
                    console.log("Content cached for offline use.");
                  }
                }
              };
            };
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const handleUpdate = () => {
    if (updateSW) {
      updateSW(); // This will now correctly call the async function
    }
  };

  return { needsUpdate, handleUpdate };
}
