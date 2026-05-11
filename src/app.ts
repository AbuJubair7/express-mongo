import { routes, controllers } from "./main.js";
import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db.js";

const server = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const intit = async () => {
  try {
    await connectDB();

    // middlewares
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // activate routes
    Object.entries(routes).forEach(([path, router]) => {
      server.use(path, router);
    });
    // activate controllers
    Object.values(controllers).forEach((controller) => {
      controller.activateRoutes();
    });
    server.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(
      `Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

intit();
