import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Ensure Login component is created
import Signup from "./Signup"; // Ensure Signup component is created
import TestGenerator from "./TestGenerator"; // Import the TestGenerator component
import Projects from "./Projects"; // Import the Projects component
import LandingPage from "./LandingPage"; // Import the LandingPage component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ensure this is declared properly

  const handleLogout = () => {
    setIsLoggedIn(false); // Update login status
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/signup"
          element={<Signup onSignup={() => setIsLoggedIn(false)} />}
        />
        <Route
          path="/landing"
          element={<LandingPage onLogout={handleLogout} />}
        />
        <Route path="/projects" element={<Projects />} />
        <Route path="/test-generator" element={<TestGenerator />} />
      </Routes>
    </Router>
  );
};

export default App;
