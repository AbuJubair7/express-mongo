import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI as string;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
