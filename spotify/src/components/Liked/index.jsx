import React, { useContext } from "react";
import { LikedContext } from "../../context/LikedContext";
import { PlayerContext } from "../../context/PlayerContext";
import "./index.css";

const Liked = ({ search = "" }) => {
  const { likedTracks, removeLikedTrack } = useContext(LikedContext);
  const searchTerm = search.toLowerCase();
  const filteredTracks = likedTracks.filter((track) => {
    const name = track.name?.toLowerCase() || "";
    const artists =
      track.artists?.map((a) => a.name.toLowerCase()).join(", ") || "";
    return name.includes(searchTerm) || artists.includes(searchTerm);
  });
  const { playTrack } = useContext(PlayerContext);

  return (
    <div className="liked-container">
      <div className="liked-content">
        <h2 className="liked-title">Liked Tracks</h2>
        {filteredTracks.length === 0 ? (
          <p className="no-tracks">No liked tracks found.</p>
        ) : (
          <div className="tracks-wrapper">
            <ul className="tracks-list">
              {filteredTracks.map((track) => (
                <li
                  key={track.id}
                  className="track-item"
                  onClick={() => playTrack(track, filteredTracks)}
                >
                  <img
                    src={
                      track.album?.images?.[0]?.url ||
                      "https://via.placeholder.com/50"
                    }
                    alt={track.name}
                    className="track-thumb"
                  />
                  <div className="track-info">
                    <div className="track-title">{track.name}</div>
                    <div className="track-artists">
                      {track.artists?.map((a) => a.name).join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLikedTrack(track.id);
                    }}
                    className="delete-btn"
                    title="Remove from liked"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liked;
