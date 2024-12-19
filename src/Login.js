import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa"; // Import eye icons from react-icons
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log("Email: ", email);
    console.log("Password: ", password);
    e.preventDefault();
    setError(""); // Reset error

    // Validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
        navigate("/landing"); // Redirect to the dashboard after successful login
      } else {
        setError(data.message || "An error occurred while logging in.");
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account? </p>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 flex items-center justify-center text-indigo-600 hover:underline focus:outline-none"
          >
            <FaHome className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
