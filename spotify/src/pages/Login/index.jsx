import React, { useState } from "react";
import cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./index.css";

const Login = () => {
  const { login } = React.useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter valid details");
      return;
    }

    const loginApiUrl = "https://apis.ccbp.in/login";
    const userDetails = { username, password };
    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(loginApiUrl, options);
      const data = await response.json();

      if (response.ok && data.jwt_token) {
        cookie.set("jwt_token", data.jwt_token, { expires: 30 });
        login(username);
        navigate("/home");
      } else {
        setError(data.error_msg || "Login failed. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        {/* Spotify logos in background */}
        <div
          className="spotify-bg-logo"
          style={{
            top: "5%",
            left: "5%",
            width: "120px",
            height: "120px",
            animationDuration: "15s",
          }}
        ></div>
        <div
          className="spotify-bg-logo"
          style={{
            top: "15%",
            right: "10%",
            width: "200px",
            height: "200px",
            animationDuration: "25s",
            animationDirection: "reverse",
          }}
        ></div>
        <div
          className="spotify-bg-logo"
          style={{
            bottom: "10%",
            left: "15%",
            width: "180px",
            height: "180px",
            animationDuration: "20s",
          }}
        ></div>
        <div
          className="spotify-bg-logo"
          style={{
            bottom: "5%",
            right: "5%",
            width: "150px",
            height: "150px",
            animationDuration: "18s",
            animationDirection: "reverse",
          }}
        ></div>
        <div
          className="spotify-bg-logo"
          style={{
            top: "40%",
            left: "8%",
            width: "100px",
            height: "100px",
            animationDuration: "22s",
          }}
        ></div>
        <div
          className="spotify-bg-logo"
          style={{
            top: "50%",
            right: "12%",
            width: "130px",
            height: "130px",
            animationDuration: "17s",
            animationDirection: "reverse",
          }}
        ></div>
      </div>
      <div className="login-card">
        <div className="login-logo">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="50" r="8" fill="#1DB954">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <rect x="35" y="30" width="8" height="40" fill="#1DB954">
              <animate
                attributeName="height"
                values="40;60;40"
                dur="0.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="30;20;30"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="50" y="20" width="8" height="60" fill="#1DB954">
              <animate
                attributeName="height"
                values="60;80;60"
                dur="0.6s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="20;10;20"
                dur="0.6s"
                repeatCount="indefinite"
              />
            </rect>
            <rect x="65" y="35" width="8" height="30" fill="#1DB954">
              <animate
                attributeName="height"
                values="30;50;30"
                dur="0.9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y"
                values="35;25;35"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </rect>
            <circle cx="85" cy="50" r="8" fill="#1DB954">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            className="login-input"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="login-input"
          />

          <label className="login-checkbox-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="login-checkbox"
            />
            <span>Show Password</span>
          </label>

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
