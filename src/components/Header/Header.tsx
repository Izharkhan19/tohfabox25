import React, { useState } from "react";
import "./Header.css";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false); // Close mobile nav after search
    }
  };

  return (
    <header className="header">
      {/* Header Left Section (Logo + Hamburger) */}
      <div className="header-section header-start">
        <img
          src="https://images.pexels.com/photos/28769885/pexels-photo-28769885/free-photo-of-festive-gift-box-with-assorted-sweets-and-cookies.jpeg?auto=compress&cs=tinysrgb&w=600"
          width={"30px"}
          height={"30px"}
          alt="Tohfabox Logo"
        />
        <span className="logo ms-2">tohfabox25</span>

        <button
          className="hamburger-menu"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
        >
          ☰
        </button>
      </div>

      {/* Main Search Nav (Centered) */}
      <nav className="main-search-nav">
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for gift hampers..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search gift hampers"
          />
          <button
            type="submit"
            className="search-icon"
            aria-label="Submit search"
          >
            🔍
          </button>
        </form>
      </nav>

      {/* Header Right Section (Desktop Navigation + Buttons) */}
      <div className="header-section header-end desktop-nav-container">
        <nav className="desktop-secondary-nav">
          {/* <ul>
            <li>
              <a href="#">Photos</a>
            </li>
            <li>
              <a href="#">Explore</a>
            </li>
            <li>
              <a href="#">License</a>
            </li>
          </ul> */}
        </nav>
        {/* <span className="more-options">...</span> */}
        <button className="join-btn">Join</button>
      </div>

      {/* Mobile Navigation - Conditionally Rendered with animation class */}
      <nav
        id="mobile-nav"
        className={`mobile-secondary-nav ${isMobileNavOpen ? "is-open" : ""}`}
        aria-hidden={!isMobileNavOpen}
      >
        <ul>
          <li>
            <a href="#" onClick={() => setIsMobileNavOpen(false)}>
              Photos
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setIsMobileNavOpen(false)}>
              Explore
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setIsMobileNavOpen(false)}>
              License
            </a>
          </li>
          <li>
            <button
              className="join-btn"
              onClick={() => setIsMobileNavOpen(false)}
            >
              Join
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
