import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import image from "./assets/ai-logo-template-vector-with-white-background_1023984-15069.avif";

const HomePage = () => {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header Section */}
      <header className="flex items-center justify-between py-2 px-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md">
        {/* Logo Section */}

        <div className="flex items-center space-x-3 flex-col">
          <div className="text-3xl font-bold tracking-wide">
            <img
              src={image}
              alt="logo"
              className="w-16 h-16 rounded-full "
            ></img>
          </div>
          <span className="text-sm italic text-red-500">
            Innovate with Confidence
          </span>
        </div>

        {/* Tagline Section */}
        <div className="text-center text-lg font-medium tracking-wide">
          AI QA Team
        </div>

        {/* Login Button Section */}
        <div>
          <Link
            //to="/login"
            to="/landing"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow px-10 py-12 bg-white rounded-md shadow-lg mx-6 mt-8">
        {/* Introduction Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to AI QA Team
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4 text-justify">
            AI QA Team is an AI-powered tool designed to simplify and automate
            the process of generating test cases and test plans. Save time and
            focus on delivering quality software, while AI handles the heavy
            lifting of test artifact creation.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Current Features Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Current Features
            </h2>
            <ul
              className="space-y-3 text-gray-600"
              style={{
                animation: "verticalscroll 5s linear infinite",
              }}
            >
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔️</span> AI-Driven Test
                Case Generation
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔️</span> Instant Test Plan
                Creation
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">✔️</span> Seamless File
                Upload and Analysis
              </li>
            </ul>
          </div>

          {/* Future Focus Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Future Focus
            </h2>
            <ul
              className="space-y-3 text-gray-600"
              style={{
                animation: "verticalscroll 5s linear infinite",
              }}
            >
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🌟</span> Collaborative
                Test Management
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🌟</span> AI-Enhanced
                Defect Prediction
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🌟</span> Expanded
                Automation Tools
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-100 text-center text-gray-600 mt-12 border-t border-gray-200">
        <p className="mb-2">
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
