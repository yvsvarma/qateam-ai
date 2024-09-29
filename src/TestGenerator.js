import React, { useState } from "react";
import {
  Button,
  LinearProgress,
  TextField,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { CloudUpload, Download } from "@mui/icons-material";

const TestGenerator = () => {
  const [file, setFile] = useState(null);
  const [downloadType, setDownloadType] = useState("test-cases");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownloadTypeChange = (e) => {
    setDownloadType(e.target.value);
    setDownloadLink(null); // Clear previous download link when option changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("downloadType", downloadType); // Pass download type to backend

    try {
      const response = await fetch("http://localhost:3000/generate-file", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      setDownloadLink(downloadUrl);
    } catch (error) {
      console.error("Error generating file:", error);
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Test Case/Plan Generator
      </Typography>

      {/* Add Download Sample BRD Button */}
      <Button
        variant="outlined"
        color="secondary"
        href="http://localhost:3000/download-sample-brd" // Ensure this route is defined correctly in server
        startIcon={<Download />}
        fullWidth
        sx={{ mb: 3 }}
      >
        Download Sample BRD
      </Button>

      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <TextField
          type="file"
          onChange={handleFileChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />

        <TextField
          select
          label="Select Download Type"
          value={downloadType}
          onChange={handleDownloadTypeChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="test-cases">Test Cases</MenuItem>
          <MenuItem value="test-plan">Test Plan</MenuItem>
        </TextField>

        {isProcessing && <LinearProgress sx={{ mb: 3 }} />}

        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          type="submit"
          fullWidth
          sx={{ mb: 3 }}
          disabled={isProcessing} // Only disabled during processing
        >
          {isProcessing ? "Processing..." : "Generate File"}
        </Button>
      </form>

      {downloadLink && (
        <Button
          variant="outlined"
          color="success"
          startIcon={<Download />}
          href={downloadLink}
          download={
            downloadType === "test-cases" ? "test-cases.csv" : "test-plan.docx"
          }
          fullWidth
          sx={{ mb: 3 }}
        >
          {`Download ${
            downloadType === "test-cases" ? "Test Cases" : "Test Plan"
          }`}
        </Button>
      )}
    </Box>
  );
};

export default TestGenerator;
