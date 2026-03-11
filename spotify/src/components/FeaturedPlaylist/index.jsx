import { useEffect, useState } from "react";
import LoadingScreen from "../../pages/LoadingScreen";
import { useNavigate } from "react-router-dom";
import "./index.css";

const FeaturedPlaylist = ({ search }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          "https://apis2.ccbp.in/spotify-clone/featured-playlists",
        );
        if (!response.ok) throw new Error("Failed to fetch playlists");
        const data = await response.json();

        setPlaylists(data?.playlists?.items || []);
      } catch (err) {
        console.error("API fetch failed, using fallback:", err);

        try {
          const mockRes = await fetch("/playlists.json");
          const mockData = await mockRes.json();
          setPlaylists(
            mockData.map((item, idx) => ({
              id: `mock_${idx}`,
              name: item.name || `Mock Playlist ${idx + 1}`,
              images: [{ url: item.image }],
              description: item.description,
            })),
          );
        } catch (mockErr) {
          console.error("Mock data fetch failed:", mockErr);
          setError("Failed to load playlists");
          setPlaylists([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <p className="playlist-error">Error: {error}</p>;

  const filtered = playlists.filter(
    (playlist) =>
      playlist.name.toLowerCase().includes((search || "").toLowerCase()) ||
      playlist.description
        ?.toLowerCase()
        .includes((search || "").toLowerCase()),
  );

  return (
    <div className="playlist-grid">
      {filtered.map((playlist) => (
        <div
          key={playlist.id}
          className="playlist-card"
          onClick={() => {
            console.log("Navigating to playlist:", playlist.id);
            navigate(`/details/${playlist.id}`);
          }}
        >
          <img
            src={playlist.images?.[0]?.url || "https://via.placeholder.com/150"}
            alt={playlist.name}
            className="playlist-image"
          />
          <h3 className="playlist-name">{playlist.name}</h3>
          <p className="playlist-description">
            {playlist.description || "No description"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPlaylist;
