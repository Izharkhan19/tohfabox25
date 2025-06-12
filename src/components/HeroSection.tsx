// import React from "react";
// import "./HeroSection.css";

// const HeroSection: React.FC = () => {
//   return (
//     <section className="hero-section">
//       <div className="container">
//         {/* <h1>Free Gift Hamper Photos</h1> */}
//         <h1>Customised Hamper's & Gift's Box</h1>
//         <div className="d-flex justify-content-center mt-2">
//           <i>
//             {/* <h6>Made with love 💖, and packed with joy... 🙌🏾</h6> */}
//             <h6>
//               ✨ Made with love 💖, wrapped in joy 🎁, and delivered with a
//               smile 😊.
//             </h6>
//           </i>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React, { useState, useEffect } from "react";
import "./HeroSection.css"; // Ensure this path is correct

// Array of background images.
// Make sure these paths are correct relative to your project's public folder
// or where your images are served from.
const backgroundImages = [
  "/images/hero1.jpg", // Example: Assuming 'hero1.jpg' is in your 'public/images' folder
  "/images/hero2.jpg", // Example: Assuming 'hero2.jpg' is in your 'public/images' folder
  "/images/hero3.jpg", // Example: Assuming 'hero3.jpg' is in your 'public/images' folder
];

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
      }}
    >
      <div className="container">
        <h1 key={currentImageIndex}>Customised Hamper's & Gift's Box</h1>
        <div className="d-flex justify-content-center mt-2">
          <i>
            <h6 key={currentImageIndex}>
              ✨ Made with love 💖, wrapped in joy 🎁, and delivered with a
              smile 😊.
            </h6>
          </i>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;