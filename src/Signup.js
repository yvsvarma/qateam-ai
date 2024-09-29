import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Signup successful! Please check your email for verification."
        );

        // Clear the fields after successful signup
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "An error occurred while signing up.");
      }
    } catch (error) {
      setError("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSignup}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success" sx={{ mb: 3 }}>
            {successMessage}
          </Typography>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Signup
        </Button>
      </form>
      <Button
        onClick={() => navigate("/")} // Navigate to login page when clicked
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
      >
        Return to Login
      </Button>
    </Box>
  );
};

export default Signup;
