import React, { useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const TestGenerator = () => {
  const [file, setFile] = useState(null);
  const [downloadType, setDownloadType] = useState("test-cases");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDownloadTypeChange = (e) => {
    setDownloadType(e.target.value);
    setDownloadLink(null); // Clear previous download link when option changes
  };

  const validateApiKey = async () => {
    // Replace with your API key validation logic
    try {
      const response = await fetch("http://localhost:3000/update-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (response.ok) {
        setIsApiKeyValid(true);
        alert("API key is valid. Fields are now enabled.");
      } else {
        alert("Invalid API key. Please try again.");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      alert("Error validating API key. Please try again.");
    }
    setApiKey("");
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
    formData.append("downloadType", downloadType);

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
      setIsProcessing(false);
    }
  };

  const goToLandingPage = () => {
    navigate("/landing");
  };

  return (
    <>
      <div className="flex justify-between items-center m-8">
        <button
          onClick={goToLandingPage}
          className="flex items-center bg-sky-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-500 transition duration-200"
        >
          <IoChevronBackCircle className="mr-2 text-2xl" />
          Back to Landing Page
        </button>
      </div>
      <div className="max-w-xl mx-auto p-6 mt-10 bg-gradient-to-r from-blue-100 to-blue-300 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          Test Case/Plan Generator
        </h1>

        {/* API Key Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={isApiKeyValid ? "" : "Enter API Key to validate & enable the fields."}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={validateApiKey}
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Validate API Key
          </button>
        </div>

        {/* Download Sample BRD Button */}
        <a
          href="http://localhost:3000/download-sample-brd"
          className={`flex items-center justify-center mb-6 p-2 ${
            isApiKeyValid ? "bg-gradient-to-r from-green-400 to-blue-500" : "bg-gray-300 cursor-not-allowed"
          } text-white rounded-lg shadow-md transition-all duration-300 ease-in-out`}
          style={{ pointerEvents: isApiKeyValid ? "auto" : "none" }}
        >
          <FiDownload className="mr-3 text-lg" />
          Download Sample BRD
        </a>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Input */}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isApiKeyValid}
          />

          {/* Select Download Type */}
          <select
            value={downloadType}
            onChange={handleDownloadTypeChange}
            className="w-full p-2 border-2 border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isApiKeyValid}
          >
            <option value="test-cases">Test Cases</option>
            <option value="test-plan">Test Plan</option>
          </select>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="w-full">
              <div className="h-2 bg-blue-500 animate-pulse rounded-full"></div>
            </div>
          )}

          {/* Generate File Button */}
          <button
            type="submit"
            disabled={!isApiKeyValid || isProcessing}
            className={`w-full p-2 text-white rounded-lg font-semibold ${
              !isApiKeyValid || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            } transition-all duration-300 ease-in-out flex items-center justify-center space-x-2`}
          >
            <FiUpload className="text-xl" />
            <span>{isProcessing ? "Processing..." : "Generate File"}</span>
          </button>
        </form>

        {/* Download Link Button */}
        {downloadLink && (
          <a
            href={downloadLink}
            download={
              downloadType === "test-cases"
                ? "test-cases.csv"
                : "test-plan.docx"
            }
            className="w-full mt-6 p-2 flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <FiDownload className="mr-3 text-lg" />
            Download {downloadType === "test-cases" ? "Test Cases" : "Test Plan"}
          </a>
        )}
      </div>
    </>
  );
};

export default TestGenerator;
