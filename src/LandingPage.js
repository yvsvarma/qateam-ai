import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 text-center bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Tester App
      </h1>
      <p className="text-lg text-gray-600 mb-8">Choose an option below:</p>
      
      <div className="flex justify-center gap-4 mb-6">
        <Link to="/projects">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200">
            Projects
          </button>
        </Link>
        <Link to="/test-generator">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200">
            Test Case Generator
          </button>
        </Link>
      </div>
      
      {/*<button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>*/}
    </div>
  );
};

export default LandingPage;
