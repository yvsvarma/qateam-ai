// Import necessary libraries
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from "bcrypt"; // Placeholder, replace with actual library
import cors from "cors";
import { createObjectCsvWriter } from "csv-writer";
import { Document, Packer, Paragraph, TextRun } from "docx";
import dotenv from "dotenv";
import express from "express";
import fs from "fs"; // Placeholder, replace with actual library
import mongoose from "mongoose";
import multer from "multer";
import nodemailer from "nodemailer";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3000;
//const apiKey = process.env.OPENAI_API_KEY;
const apiKey = process.env.API_KEY_FOR_AI;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
let openai, genAI, model;
// Initialize OpenAI API
if (apiKey.startsWith("sk-proj")) {
  openai = new OpenAI({ apiKey });
} else {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// User schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
});
const User = mongoose.model("User", userSchema);
// Helper function to detect API provider
function detectAIProvider(apiKey) {
  if (apiKey.startsWith("sk-")) return "openai"; // Example: OpenAI keys start with "sk-"
  if (apiKey.startsWith("bing-")) return "bing"; // Example: Bing keys might start with "bing-"
  if (apiKey.startsWith("gem-")) return "gemini"; // Example: Gemini keys might start with "gem-"
  throw new Error("Unsupported API key format.");
}

// Helper function to initialize the AI client
function initializeAIClient(apiKey) {
  const provider = detectAIProvider(apiKey);
  switch (provider) {
    case "openai":
      return new OpenAI({ apiKey });
    case "bing":
    //return new BingAI({ apiKey });
    case "gemini":
    //return new GeminiAI({ apiKey });
    default:
      throw new Error("AI provider not supported.");
  }
}
// Initialize AI client
let aiClient;
try {
  const apiKey = process.env.API_KEY_FOR_AI;
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  //aiClient = initializeAIClient(apiKey);
  console.log("AI client initialized successfully.");
} catch (error) {
  console.error("Error initializing AI client:", error.message);
  process.exit(1);
}

// Verify route
app.get("/verify/:token", async (req, res, next) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token." });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// File generation route
app.post("/generate-file", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File is required." });
    const brdContent = req.file.buffer.toString();
    const prompt = `Generate a test plan based on the following BRD content:\n${brdContent}`;
    let response, generatedContent, result;
    if (apiKey.startsWith("sk-proj")) {
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });
      generatedContent = response.choices[0].message.content;
    } else {
      result = await model.generateContent(prompt);
      generatedContent = result.response.text();
    }

    //generatedContent = response.choices[0].message.content;

    if (req.body.downloadType === "test-cases") {
      const csvWriter = createObjectCsvWriter({
        path: "uploads/test-cases.csv",
        header: [
          { id: "id", title: "ID" },
          { id: "testCase", title: "Test Case" },
        ],
      });
      const rows = generatedContent.split("\n").map((testCase, index) => ({
        id: index + 1,
        testCase: testCase.trim(),
      }));
      await csvWriter.writeRecords(rows);
      res.download("uploads/test-cases.csv", "test-cases.csv");
    } else if (req.body.downloadType === "test-plan") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({ children: [new TextRun(generatedContent)] }),
            ],
          },
        ],
      });
      const buffer = await Packer.toBuffer(doc);
      const testPlanPath = path.join(__dirname, "uploads", "test-plan.docx");
      fs.writeFileSync(testPlanPath, buffer);
      res.download(testPlanPath, "test-plan.docx");
    } else {
      res.status(400).json({ message: "Invalid download type." });
    }
  } catch (error) {
    next(error);
  }
});

// Sample BRD download route
app.get("/download-sample-brd", (req, res) => {
  const file = path.join(__dirname, "public", "files", "sample-brd.docx");
  res.download(file, "sample_brd.docx", (err) => {
    if (err) {
      console.error("File download error:", err);
      res.status(500).send("Error downloading file.");
    }
  });
});

// Endpoint to update and validate API Key
app.post("/update-api-key", (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res
      .status(400)
      .json({ valid: false, message: "API Key is required" });
  }

  // Update the .env file with the new API key
  fs.readFile(".env.local", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return res.status(500).json({ message: "Server error" });
    }

    // Update or add the API_KEY line
    const envContent = data.includes("API_KEY_FOR_AI")
      ? data.replace(/API_KEY_FOR_AI=.*/, `API_KEY_FOR_AI=${apiKey}`)
      : `${data}\nAPI_KEY_FOR_AI=${apiKey}`;

    // Write the updated content back to the .env file
    fs.writeFile(".env.local", envContent, (writeErr) => {
      if (writeErr) {
        console.error("Error updating .env file:", writeErr);
        return res.status(500).json({ message: "Failed to save API key" });
      }

      // Reload the updated environment variables
      process.env.API_KEY_FOR_AI = apiKey;
      if (apiKey.startsWith("sk-proj")) {
        openai = new OpenAI({ apiKey });
      } else {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      }

      res.json({ valid: true, message: "API Key updated successfully" });
    });
  });
});

// Central error-handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
