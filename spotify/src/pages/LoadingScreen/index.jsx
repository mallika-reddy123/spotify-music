import React from "react";
import "./index.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-bars">
        {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
          <span
            key={i}
            className="loading-bar"
            style={{ animationDelay: `${delay}s` }}
          ></span>
        ))}
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}