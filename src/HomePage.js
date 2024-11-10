import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation

const HomePage = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header Section */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        {/* Logo */}
        <div style={{ fontWeight: "bold", fontSize: "24px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            {/* Your Logo */}
            ProductLogo
          </Link>
        </div>

        {/* Product Name / Tagline in Center */}
        <div style={{ fontSize: "20px", fontWeight: "500" }}>AI QA Team</div>

        {/* Login Button */}
        <Link
          to="/login"
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Get Started
        </Link>
      </header>

      {/* Main Section */}
      <main style={{ padding: "20px" }}>
        {/* Introduction Section */}
        <section style={{ marginBottom: "40px" }}>
          <h1>Welcome to AI QA Team</h1>
          <p style={{ fontSize: "18px", maxWidth: "800px", margin: "0 auto" }}>
            AI QA Team is an AI-powered tool designed to simplify and automate
            the process of generating test cases and test plans. Save time and
            focus on delivering quality software, while AI handles the heavy
            lifting of test artifact creation.
          </p>
        </section>

        {/* Current Features Section */}
        <section style={{ marginBottom: "40px" }}>
          <h2>Current Features</h2>
          <ul style={{ listStyleType: "none", padding: 0, fontSize: "16px" }}>
            <li>🔹 AI-Driven Test Case Generation</li>
            <li>🔹 Instant Test Plan Creation</li>
            <li>🔹 Seamless File Upload and Analysis</li>
          </ul>
        </section>

        {/* Future Focus Section */}
        <section style={{ marginBottom: "40px" }}>
          <h2>Future Focus</h2>
          <ul style={{ listStyleType: "none", padding: 0, fontSize: "16px" }}>
            <li>🔹 Collaborative Test Management</li>
            <li>🔹 AI-Enhanced Defect Prediction</li>
            <li>🔹 Expanded Automation Tools</li>
          </ul>
        </section>
      </main>

      {/* Footer Section */}
      <footer
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #dee2e6",
          textAlign: "center",
        }}
      >
        <p>
          Our vision is to empower the QA community by providing tools that
          simplify testing and allow teams to focus on delivering high-quality
          software.
        </p>
        <p>© 2024 AI QA Team. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
