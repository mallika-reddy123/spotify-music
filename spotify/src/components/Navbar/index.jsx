import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.css";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const location = useLocation();

  const searchEnabledPaths = [
    "/",
    "/home",
    "/categories",
    "/new-releases",
    "/liked",
  ];
  const isSearchEnabled =
    searchEnabledPaths.includes(location.pathname) ||
    location.pathname.startsWith("/details/");

  const getPlaceholderText = () => {
    switch (location.pathname) {
      case "/categories":
        return " 🔍 Search categories...";
      case "/new-releases":
        return " 🔍 Search new releases...";
      case "/liked":
        return " 🔍 Search liked tracks...";
      default:
        return " 🔍 Search songs...";
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch && onSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="https://www.logo.wine/a/logo/Spotify/Spotify-Icon-Logo.wine.svg"
          alt="Spotify Logo"
          className="logo-img"
        />
        <span className="logo-text">Spotify</span>
      </div>

      {isSearchEnabled ? (
        <form onSubmit={submit} className="navbar-search">
          <input
            className="search-input"
            placeholder={getPlaceholderText()}
            value={query}
            onChange={handleInputChange}
          />
        </form>
      ) : (
        <div className="navbar-search-placeholder"></div>
      )}
    </nav>
  );
};

export default Navbar;
