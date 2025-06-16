import React, { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { SuccessToast } from "../Common/toastUtils";
import { getItem } from "../Common/CommonServices";

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate: any = useNavigate();
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

  const handleLogout = (event: any) => {
    event.preventDefault();
    localStorage.clear();
    navigate("/");
    SuccessToast("Signout successfully.");
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

        {/* <button
          className="hamburger-menu"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
        >
          ☰
        </button> */}
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

        <button className="ms-3" onClick={handleLogout} title="Signout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation - Conditionally Rendered with animation class */}
      <nav
        id="mobile-nav"
        className={`mobile-secondary-nav ${isMobileNavOpen ? "is-open" : ""}`}
        aria-hidden={!isMobileNavOpen}
      >
        <ul>
          {/* <li>
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
          */}
          <li>
            <button onClick={handleLogout} title="Signout">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
