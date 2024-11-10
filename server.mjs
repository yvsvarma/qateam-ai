import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { createObjectCsvWriter } from "csv-writer";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { OpenAI } from "openai";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });
const app = express();
const apiKey = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage to hold file in memory
const upload = multer({ storage: storage });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const verificationToken = Math.random().toString(36).substr(2);

  const newUser = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    verificationToken,
  });

  try {
    await newUser.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Verification",
      text: `Please verify your account by clicking the link: 
      http://localhost:3000/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Signup successful! Please check your email for verification.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "Error creating account. Please try again." });
  }
});

// Verify Route
app.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid token." });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.redirect("/");
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ email: username });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email to log in." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch && user.isVerified) {
    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid username or password." });
  }
});

// Route for generating a file
app.post("/generate-file", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "File is required to generate the file." });
  }

  const brdContent = req.file.buffer.toString(); // Read the uploaded file content
  const prompt = `Generate a test plan based on the following BRD content:\n${brdContent}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const generatedContent = response.choices[0].message.content;

    if (req.body.downloadType === "test-cases") {
      // Generate CSV for test cases
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

      res.download("uploads/test-cases.csv", "test-cases.csv", (err) => {
        if (err) {
          console.error("Error sending the file:", err);
        }
      });
    } else if (req.body.downloadType === "test-plan") {
      // Generate Word document for test plan
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(generatedContent)],
              }),
            ],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      const testPlanPath = path.join(__dirname, "uploads", "test-plan.docx");
      fs.writeFileSync(testPlanPath, buffer);

      res.download(testPlanPath, "test-plan.docx", (err) => {
        if (err) {
          console.error("Error sending the file:", err);
        }
      });
    } else {
      res.status(400).json({ message: "Invalid download type." });
    }
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).json({ error: "Something went wrong." });
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

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
