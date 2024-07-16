import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import Vocab from "./models/vocabs.js";
import User from "./models/User.js";
import { insertData, readQuizData, addUserIfNotExists } from "./utils/index.js";
// import { GenerateQuizDataAI, getNextLevel } from "./ai/index.js";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

const app = express();

app.set("view engine", "ejs");
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "hello",
  });
});

// connect to mongodb
const DBUri =
  "mongodb+srv://nargesshaker229:PoGzdDe7jWyN0EFf@cluster0.ijqrqir.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(DBUri)
  .then((res) => {
    app.listen(3000);
    console.log("connected to db");
  })
  .catch(() => {
    console.log("err db");
  });

// to isert words data to db
// insertData();

app.get("/getQuiz", async (req, res) => {
  try {
    // Read data from the file asynchronously
    fs.readFile("./Data/quiz.json", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.status(500).json({ error: "Error reading file" });
        return;
      }

      // Parse JSON data from the file
      const jsonData = JSON.parse(data);

      // Send the data to the user
      res.status(200).json(jsonData);
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const chosenwords = [
  { word: "Abundant" },
  { word: "Assume" },
  { word: "Apprehensive" },
  { word: "Anticipate" },
  { word: "Attribute" },
  { word: "Authenticate" },
  { word: "Biased" },
  { word: "Coherent" },
  { word: "Comprehensive" },
  { word: "Contend" },
];

app.get("/words", async (req, res) => {
  try {
    const data = await Vocab.find();

    // const chosenwords = await GenerateQuizDataAI(data);

    const filtered = data.filter((r) => {
      console.log(chosenwords);
      const f = chosenwords.find((c) => c.word === r.word);
      console.log(f);
      return f;
    });
    res.status(200).json({
      filtered,
    });
  } catch (er) {
    console.log("err", er);
  }
});

app.post("/getnextlevel", async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Token is missing",
    });
  }
  try {
    const user = await User.findOne({ token: token });
    if (user) {
      // To avoid waisting token
      // const nextLevel = await getNextLevel(user.words);
      // return res.status(200).json({
      //   nextLevel: JSON.parse(nextLevel),
      // });

      const nextLevel = await Vocab.find().limit(5);
      console.log(nextLevel);
      return res.status(200).json({
        nextLevel: { words: nextLevel },
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { access_token } = req.body;
  console.log(access_token);
  const userData = await oauth2Client.verifyIdToken({
    idToken: access_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = userData.getPayload();
  const payloadObject = {
    email: payload.email,
    name: payload.given_name,
    surname: payload.family_name,
    token: access_token,
  };
  const InsertedUser = addUserIfNotExists(payloadObject);
  if (InsertedUser) {
    res.status(200).json({
      ...payloadObject,
      words: InsertedUser.words | [],
      verified: true,
    });
  } else {
    res.status(200).json({
      error: "user already exists",
    });
  }
});

app.post("/update/knowledge", async (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Token is missing",
    });
  }
  try {
    // Find the user by token
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Merge the words, removing duplicates
    const mergedWords = Array.from(new Set([...user.words, ...req.body]));
    console.log("mergedWords", mergedWords);
    // Update the user's words
    user.words = mergedWords;
    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User knowledge updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});
