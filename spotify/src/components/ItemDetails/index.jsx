import React, { useEffect, useState, useContext } from "react";
import cookie from "js-cookie";
import { PlayerContext } from "../../context/PlayerContext";
import { LikedContext } from "../../context/LikedContext";
import { useParams, useNavigate } from "react-router-dom";
import LoadingScreen from "../../pages/LoadingScreen";
import "./index.css";

const ItemDetails = () => {
  const { id } = useParams();
  const { playTrack, currentTrack, isPlaying, pause } =
    useContext(PlayerContext);
  const { likedTracks, addLikedTrack, removeLikedTrack } =
    useContext(LikedContext);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching details for ID:", id);

        if (id.startsWith("mock_")) {
          await handleMockData();
        } else {
          await handleAPIData();
        }
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(err.message);
        try {
          await handleMockData();
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
          setNotFound();
        }
      } finally {
        setLoading(false);
      }
    };

    const handleMockData = async () => {
      const mockRes = await fetch("/playlists.json");
      if (!mockRes.ok) {
        throw new Error("Failed to fetch mock data");
      }

      const mockData = await mockRes.json();
      const idx = parseInt(id.replace("mock_", ""), 10);
      const mockItem = mockData[idx];

      if (!mockItem) {
        throw new Error("Mock item not found");
      }

      setItem({
        name: mockItem.name,
        images: [{ url: mockItem.image }],
        description: mockItem.description || "No description available",
      });

      setTracks([
        {
          id: "track1",
          name: "Sample Track 1",
          album: { name: "Mock Album", images: [{ url: mockItem.image }] },
          artists: [{ name: "Mock Artist" }],
          duration_ms: 180000,
          preview_url: "",
        },
        {
          id: "track2",
          name: "Sample Track 2",
          album: { name: "Mock Album", images: [{ url: mockItem.image }] },
          artists: [{ name: "Mock Artist" }],
          duration_ms: 200000,
          preview_url: "",
        },
      ]);
    };

    const handleAPIData = async () => {
      const token = cookie.get("jwt_token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const playlistRes = await fetch(
          `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!playlistRes.ok) {
          throw new Error(
            `Failed to fetch playlist details: ${playlistRes.status}`,
          );
        }

        const playlistData = await playlistRes.json();
        const playlist = playlistData.playlist || playlistData;

        if (!playlist) {
          setError("No playlist found in response.");
          return;
        }

        setItem({
          name: playlist.name || "Unknown Playlist",
          images: playlist.images || [],
          description: playlist.description || "No description available",
        });

        let tracksData = [];
        if (playlistData.tracks?.items) {
          tracksData = playlistData.tracks.items
            .map((item) => item.track || item)
            .filter((track) => track && track.id);
        } else if (playlist.tracks?.items) {
          tracksData = playlist.tracks.items
            .map((item) => item.track || item)
            .filter((track) => track && track.id);
        }

        const processedTracks = tracksData.map((track) => ({
          id: track.id,
          name: track.name || "Unknown Track",
          album: {
            name: track.album?.name || "Unknown Album",
            images: track.album?.images || [],
          },
          artists: Array.isArray(track.artists)
            ? track.artists
            : [{ name: "Unknown Artist" }],
          duration_ms: track.duration_ms || 0,
          preview_url: track.preview_url || "",
        }));

        setTracks(processedTracks);
      } catch (err) {
        setError(err.message || "Failed to fetch playlist details.");
      }
    };

    const setNotFound = () => {
      setItem({
        name: "Playlist Not Found",
        images: [
          {
            url: "https://c8.alamy.com/comp/JRY983/icon-logo-spotify-music-streaming-service-music-streaming-macro-detail-JRY983.jpg",
          },
        ],
        description: "The requested playlist could not be found.",
      });
      setTracks([]);
    };

    if (id) {
      fetchDetails();
    }
  }, [id, navigate]);

  const formatDuration = (ms) => {
    if (!ms) return "--:--";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) return <LoadingScreen />;
  if (!item) return <div className="details-no-data">No data available</div>;

  return (
    <div className="details-wrapper">
      <div className="details-container">
        <button onClick={() => navigate(-1)} className="back-button">
          X
        </button>
        {error && <div className="error-banner">Error: {error}</div>}

        <div className="details-header">
          <img
            src={item.images?.[0]?.url || "https://via.placeholder.com/150"}
            alt={item.name}
            className="details-image"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
          <h2 className="details-title">{item.name}</h2>
          <p className="details-description">{item.description}</p>
          <p className="details-track-count">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="tracks-section">
          {tracks.length > 0 ? (
            <ul className="tracks-list-details">
              {tracks.map((track, idx) => (
                <li key={track.id || idx} className="track-card">
                  <div className="track-mobile">
                    <img
                      src={
                        track.album?.images?.[0]?.url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={track.album?.name}
                      className="track-img-mobile"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div className="track-info-mobile">
                      <h3 className="track-title-mobile">{track.name}</h3>
                      <p className="track-album-mobile">{track.album?.name}</p>
                      <p className="track-artist-mobile">
                        {track.artists?.map((artist) => artist.name).join(", ")}
                      </p>
                      <span className="track-duration-mobile">
                        Duration: {formatDuration(track.duration_ms)}
                      </span>
                    </div>
                  </div>

                  <div className="track-desktop">
                    <img
                      src={
                        track.album?.images?.[0]?.url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={track.album?.name}
                      className="track-img-desktop"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div className="track-info-desktop">
                      <h3 className="track-title-desktop">{track.name}</h3>
                      <p className="track-album-desktop">{track.album?.name}</p>
                      <p className="track-artist-desktop">
                        {track.artists?.map((artist) => artist.name).join(", ")}
                      </p>
                      <span className="track-duration-desktop">
                        Duration: {formatDuration(track.duration_ms)}
                      </span>
                    </div>

                    <div className="track-actions">
                      <button
                        className={`track-like-btn ${likedTracks.find((t) => t.id === track.id) ? "liked" : ""}`}
                        onClick={() => {
                          if (likedTracks.find((t) => t.id === track.id)) {
                            removeLikedTrack(track.id);
                          } else {
                            addLikedTrack(track);
                          }
                        }}
                      >
                        ♥
                      </button>
                      <button
                        className="track-play-btn"
                        onClick={() => {
                          if (
                            currentTrack &&
                            currentTrack.id === track.id &&
                            isPlaying
                          ) {
                            pause();
                          } else {
                            playTrack(track, tracks);
                          }
                        }}
                      >
                        {currentTrack &&
                        currentTrack.id === track.id &&
                        isPlaying ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="track-actions-mobile">
                    <button
                      className={`track-like-btn ${likedTracks.find((t) => t.id === track.id) ? "liked" : ""}`}
                      onClick={() => {
                        if (likedTracks.find((t) => t.id === track.id)) {
                          removeLikedTrack(track.id);
                        } else {
                          addLikedTrack(track);
                        }
                      }}
                    >
                      ♥
                    </button>
                    <button
                      className="track-play-btn"
                      onClick={() => {
                        if (
                          currentTrack &&
                          currentTrack.id === track.id &&
                          isPlaying
                        ) {
                          pause();
                        } else {
                          playTrack(track, tracks);
                        }
                      }}
                    >
                      {currentTrack &&
                      currentTrack.id === track.id &&
                      isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-tracks-msg">
              {loading ? "Loading tracks..." : "No tracks available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
