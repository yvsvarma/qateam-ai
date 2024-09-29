import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const LandingPage = ({ onLogout }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    onLogout(); // Call the logout function passed as a prop
    navigate("/"); // Navigate to the login page
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to the Tester App
      </Typography>
      <Typography variant="h6" gutterBottom>
        Choose an option below:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Button component={Link} to="/projects" variant="contained">
          Projects
        </Button>
        <Button component={Link} to="/test-generator" variant="contained">
          Test Case Generator
        </Button>
      </Box>
      <Button
        variant="outlined"
        color="error"
        onClick={handleLogout}
        sx={{ mt: 3 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LandingPage;
