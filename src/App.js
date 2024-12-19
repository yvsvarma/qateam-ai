import React, { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import HomePage from "./HomePage";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Projects from "./Projects";
import TestGenerator from "./TestGenerator";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />

        {/* Protected routes */}
        <Route
          path="/projects"
          element={
            //<ProtectedRoute>
            <Projects />
            //</ProtectedRoute>
          }
        />
        <Route
          path="/test-generator"
          element={
            //<ProtectedRoute>
            <TestGenerator />
            //</ProtectedRoute>
          }
        />

        {}
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
