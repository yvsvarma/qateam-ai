// src/Projects.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  // Fetch existing projects from the server (for simplicity, this example uses local state)
  useEffect(() => {
    // Replace this with an API call if necessary
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(savedProjects);
  }, []);

  const handleAddOrUpdateProject = () => {
    if (editingIndex >= 0) {
      // Update project
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = projectName;
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      setEditingIndex(-1);
    } else {
      // Add new project
      const newProjects = [...projects, projectName];
      setProjects(newProjects);
      localStorage.setItem("projects", JSON.stringify(newProjects));
    }
    setProjectName("");
  };

  const handleEditProject = (index) => {
    setEditingIndex(index);
    setProjectName(projects[index]);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <TextField
        label="Project Name"
        variant="outlined"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddOrUpdateProject}
      >
        {editingIndex >= 0 ? "Update Project" : "Add Project"}
      </Button>

      <List>
        {projects.map((project, index) => (
          <ListItem key={index}>
            <ListItemText primary={project} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditProject(index)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteProject(index)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Projects;
