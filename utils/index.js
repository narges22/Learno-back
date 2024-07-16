import fs from "fs";
import Vocab from "../models/vocabs.js";
import User from "../models/User.js";

export const insertData = () => {
  const filePath = "./Data/words.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Insert the array of objects into the database
      Vocab.insertMany(jsonData)
        .then((docs) => {
          console.log("Documents inserted:", docs);
        })
        .catch((error) => {
          console.error("Error inserting documents:", error);
        });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });
};

export const readQuizData = async () => {
  const filePath = "./Data/quiz.json";

  await fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    const jsonData = JSON.parse(data);

    return jsonData;
  });
};

export const addUserIfNotExists = async (userData) => {
  try {
    const user = await User.findOne({ email: userData.email });

    if (user) {
      // Update the token and quizAnswers if user exists
      user.token = userData.token;
      user.quizAnswers = userData.quizAnswers;
      await user.save();
    } else {
      // Add new user if it does not exist
      const newUser = new User({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        token: userData.token,
        quizAnswers: userData.quizAnswers,
      });
      await newUser.save();
    }

    return user || newUser;
  } catch (err) {
    console.error("Error adding user:", err);
    return false;
  }
};
