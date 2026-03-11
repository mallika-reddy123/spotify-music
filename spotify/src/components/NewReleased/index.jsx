import React, { useEffect, useState } from "react";
import LoadingScreen from "../../pages/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./index.css";

const NewReleased = () => {
  const [releases, setReleases] = useState([]);
  const [filteredReleases, setFilteredReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch(
          "https://apis2.ccbp.in/spotify-clone/new-releases",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch new releases");
        }
        const data = await response.json();
        const releasesData = data?.albums?.items || [];
        setReleases(releasesData);
        setFilteredReleases(releasesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  // Search functionality for new releases
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredReleases(releases);
      return;
    }

    const filtered = releases.filter(
      (album) =>
        album.name.toLowerCase().includes(query.toLowerCase()) ||
        album.artists?.some((artist) =>
          artist.name.toLowerCase().includes(query.toLowerCase()),
        ),
    );
    setFilteredReleases(filtered);
  };

  if (loading) return <LoadingScreen />;

  if (error)
    return (
      <div>
        <Navbar onSearch={handleSearch} />
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="new-released">
      <Navbar onSearch={handleSearch} />
      <div className="albums-grid">
        {filteredReleases.length > 0 ? (
          filteredReleases.map((album) => (
            <div
              key={album.id}
              className="album-card"
              onClick={() => navigate(`/details/${album.id}`)}
            >
              <img
                src={
                  album.images?.[0]?.url || "https://via.placeholder.com/150"
                }
                alt={album.name}
                className="album-image"
              />
              <h3 className="album-name">{album.name}</h3>
              <p className="album-artists">
                {album.artists?.map((a) => a.name).join(", ")}
              </p>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No new releases found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewReleased;
