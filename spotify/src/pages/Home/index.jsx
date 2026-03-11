import { useEffect, useState } from "react";
import Categories from "../../components/Categories";
import NewReleased from "../../components/NewReleased";
import FeaturedPlaylist from "../../components/FeaturedPlaylist";
import Navbar from "../../components/Navbar";
import "./index.css";

const Home = () => {
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("activeSection") || "featured",
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    const showCategoriesHandler = () => setActiveSection("categories");
    const showNewReleasedHandler = () => setActiveSection("newReleases");
    const showHomePlaylistsHandler = () => setActiveSection("featured");

    window.addEventListener("show-categories", showCategoriesHandler);
    window.addEventListener("show-new-releases", showNewReleasedHandler);
    window.addEventListener("show-home-playlists", showHomePlaylistsHandler);

    return () => {
      window.removeEventListener("show-categories", showCategoriesHandler);
      window.removeEventListener("show-new-releases", showNewReleasedHandler);
      window.removeEventListener(
        "show-home-playlists",
        showHomePlaylistsHandler,
      );
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <Navbar onSearch={setSearch} />

        <div className="home-main">
          <div className="home-header">
            <h2 className="home-title">Welcome to Spotify Remix</h2>
          </div>

          {activeSection === "categories" ? (
            <Categories search={search} />
          ) : activeSection === "newReleases" ? (
            <NewReleased search={search} />
          ) : (
            <FeaturedPlaylist search={search} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
