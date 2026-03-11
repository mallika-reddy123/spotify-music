import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import LikedProvider from "./context/LikedContext";
import PlayerProvider from "./context/PlayerContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Categories from "./components/Categories";
import NewReleased from "./components/NewReleased";
import Liked from "./components/Liked";
import ItemDetails from "./components/ItemDetails";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Player from "./components/Player";

const PageLayout = ({ children }) => {
  const [search, setSearch] = React.useState("");

  return (
    <>
      <Sidebar />
      <div className="page-content">
        <Navbar onSearch={setSearch} />
        <div className="page-main">
          {React.cloneElement(children, { search })}
        </div>
      </div>
    </>
  );
};

const AppContent = () => {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <div className="app-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <PlayerProvider>
      <div className="app-container">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/new-releases" element={<NewReleased />} />
            <Route
              path="/liked"
              element={
                <PageLayout>
                  <Liked />
                </PageLayout>
              }
            />
            <Route
              path="/details/:id"
              element={
                <PageLayout>
                  <ItemDetails />
                </PageLayout>
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        <Player />
      </div>
    </PlayerProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LikedProvider>
        <Router>
          <AppContent />
        </Router>
      </LikedProvider>
    </AuthProvider>
  );
};

export default App;
