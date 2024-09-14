import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

config({
  path: "./.env",
});

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
