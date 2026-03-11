import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Spotify Remix</h2>
        </div>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li>
              <button
                onClick={() => navigate("/home")}
                className="menu-btn home-btn"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/categories")}
                className="menu-btn categories-btn"
              >
                Categories
              </button>
              <button
                onClick={() => navigate("/new-releases")}
                className="menu-btn releases-btn"
              >
                New Release
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/liked")}
                className="menu-btn liked-btn"
              >
                Liked
              </button>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button onClick={logout} className="menu-btn logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Horizontal Sidebar */}
      <nav className="sidebar-mobile">
        <ul className="mobile-menu">
          <li>
            <button
              onClick={() => navigate("/home")}
              className="mobile-btn home-btn"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/categories")}
              className="mobile-btn categories-btn"
            >
              Categories
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/new-releases")}
              className="mobile-btn releases-btn"
            >
              New Release
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/liked")}
              className="mobile-btn liked-btn"
            >
              Liked
            </button>
          </li>
          <li>
            <button onClick={logout} className="mobile-btn logout-btn">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
