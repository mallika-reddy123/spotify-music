import React, { useContext, useRef, useState, useEffect } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import { LikedContext } from "../../context/LikedContext";
import "./index.css";

const ALT_IMAGE =
  "https://img.freepik.com/premium-photo/spotify-logo_996353-1684.jpg?semt=ais_incoming&w=740&q=80";

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    next,
    prev,
    setSeek,
    volume,
    setVolume,
    duration,
    setDuration,
    setCurrentTime,
    currentTime,
  } = useContext(PlayerContext);
  const audioRef = useRef(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const { likedTracks, addLikedTrack, removeLikedTrack } =
    useContext(LikedContext);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    setSeek(value);
    setIsSeeking(true);
  };

  const handleSeekCommit = (e) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
    setIsSeeking(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="player-container">
      <div className="player-track-info">
        <img
          src={currentTrack?.album?.images?.[0]?.url || ALT_IMAGE}
          alt={currentTrack?.name || "No track selected"}
          className="track-image"
        />
        <div className="track-details">
          <div className="track-name">
            {currentTrack?.name || "No track selected"}
          </div>
          <div className="track-artist">
            {currentTrack?.artists?.map((a) => a.name).join(", ") || ""}
          </div>
        </div>
        <button
          className={`like-button ${currentTrack && likedTracks.find((t) => t.id === currentTrack.id) ? "liked" : ""}`}
          title={
            currentTrack && likedTracks.find((t) => t.id === currentTrack.id)
              ? "Unlike"
              : "Like"
          }
          onClick={() => {
            if (!currentTrack) return;
            if (likedTracks.find((t) => t.id === currentTrack.id)) {
              removeLikedTrack(currentTrack.id);
            } else {
              addLikedTrack(currentTrack);
            }
          }}
        >
          ♥
        </button>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button onClick={prev} className="control-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 6v12h2V6H6zm3.5 6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>
          <button onClick={isPlaying ? pause : play} className="play-pause-btn">
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button onClick={next} className="control-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 6v12h2V6h-2zm-3.5 6L4 6v12l8.5-6z" />
            </svg>
          </button>
        </div>
        <div className="seek-bar-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            className="seek-bar"
          />
          <span className="time-display">
            {formatTime(
              currentTrack?.duration_ms
                ? currentTrack.duration_ms / 1000
                : duration,
            )}
          </span>
        </div>
      </div>

      <div className="player-volume">
        <span className="volume-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" />
          </svg>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.url || currentTrack?.preview_url || ""}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default Player;
