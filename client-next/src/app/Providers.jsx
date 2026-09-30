"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="mobile-toast"
        bodyClassName="mobile-toast-body"
        style={{
          width: "min(96vw, 48rem)",
          left: "50%",
          top: "1rem",
          bottom: "auto",
          transform: "translateX(-50%)",
        }}
      />
    </>
  );
}
