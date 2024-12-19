import React, { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./index.css";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(savedProjects);
  }, []);

  const handleAddOrUpdateProject = () => {
    if (!projectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }

    setError(""); // Clear error message if valid

    if (editingIndex >= 0) {
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectName;
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      setEditingIndex(-1);
    } else {
      const newProjects = [...projects, projectName];
      setProjects(newProjects);
      localStorage.setItem("projects", JSON.stringify(newProjects));
    }
    setProjectName("");
  };

  const handleEditProject = (index) => {
    setEditingIndex(index);
    setProjectName(projects[index]);
    setError("");
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setProjectName("");
    setError("");
  };
  // Navigate back to the landing page
  const goToLandingPage = () => {
    navigate("/landing");
  };
  return (
    <div className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={goToLandingPage}
          className="flex items-center bg-sky-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-500 transition duration-200"
        >
          <IoChevronBackCircle className="mr-2 text-2xl" />
          Back to Landing Page
        </button>
      </div>

      <div className="max-w-xl mx-auto mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddOrUpdateProject}
          className={`px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200 flex items-center gap-1 ${
            projectName.trim()
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!projectName.trim()}
        >
          {editingIndex >= 0 ? "Update" : "Add"}
        </button>
        {editingIndex >= 0 && (
          <button
            onClick={handleCancelEdit}
            className="bg-red-400 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-red-500 transition duration-200 flex items-center gap-1"
          >
            <FaTimes />
            Cancel
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <ul className="max-w-xl mx-auto space-y-4">
        {projects.map((project, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <span className="text-gray-700 font-medium">{project}</span>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleEditProject(index)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
                aria-label="Edit Project"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDeleteProject(index)}
                className="text-red-500 hover:text-red-700 flex items-center"
                aria-label="Delete Project"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;
