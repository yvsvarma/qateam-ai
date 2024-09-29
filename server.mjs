import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose"; // Ensure mongoose is imported for DB operations
import nodemailer from "nodemailer"; // Add nodemailer for sending emails
import bcrypt from "bcrypt"; // For password hashing
import { createObjectCsvWriter } from "csv-writer"; // For CSV file creation
import { Document, Packer, Paragraph, TextRun } from "docx"; // For Word document creation
import { fileURLToPath } from "url"; // For ES module

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const apiKey = process.env.OPENAI_API_KEY;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3001", // Change to your frontend URL if deploying
    credentials: true, // Allow credentials to be included
  })
);

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false }, // Flag for verification
  verificationToken: String, // Token for email verification
});

const User = mongoose.model("User", userSchema);

// Route for signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Log the signup attempt
  console.log(`Signup attempt: Name: ${name}, Email: ${email}`);

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const verificationToken = Math.random().toString(36).substr(2); // Simple token generation

  const newUser = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10), // Hash password
    verificationToken,
  });

  try {
    await newUser.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
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

// Route for verifying email
app.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid token." });
  }

  user.isVerified = true;
  user.verificationToken = undefined; // Remove token after verification
  await user.save();

  res.redirect("/"); // Redirect to the login page or wherever you want
});

// Route for login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(`Login attempt: ${username}`); // Log received credentials

  const user = await User.findOne({ email: username }); // Use email as username
  res.status(200).json({ message: "Login successful!" });

  // if (!user) {
  // res.status(200).json({ message: "Login successful!" });

  //return res.status(401).json({ message: "Invalid username or password." });
  // }

  // const isMatch = await bcrypt.compare(password, user.password);

  // if (isMatch && user.isVerified) {
  //   res.status(200).json({ message: "Login successful!" });
  // } else {
  //   res.status(200).json({ message: "Login successful!" });

  //   //res.status(401).json({ message: "Invalid username or password." });
  // }
});
app.get("/download-sample-brd", (req, res) => {
  const file = path.join(__dirname, "public", "files", "sample-brd.docx"); // Adjust path accordingly
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
