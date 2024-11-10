import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import TestGenerator from "./TestGenerator";
import Projects from "./Projects";
import HomePage from "./HomePage";
import LandingPage from "./LandingPage"; // Correctly import LandingPage

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<Signup onSignup={() => setIsLoggedIn(false)} />}
        />
        <Route path="/projects" element={<Projects />} />
        <Route path="/test-generator" element={<TestGenerator />} />

        {/* Use LandingPage instead of Landing */}
        <Route
          path="/landing"
          element={
            isLoggedIn ? (
              <LandingPage onLogout={handleLogout} />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
