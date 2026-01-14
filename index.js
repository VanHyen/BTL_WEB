// index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import httpErrors from "http-errors";

import { requestLogger } from "./middlewares/logger.middleware.js";
import apiRoutes from "./routes/api.js";
import { logger } from "./config/logger.js";
import { pool } from "./config/database.js"; // Đảm bảo kết nối DB được khởi tạo

dotenv.config();

const app = express();

// ---------------------------
// Basic & Security Middlewares
// ---------------------------

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

// ---------------------------
// Custom Logging Middleware
// ---------------------------
app.use(requestLogger);

// ---------------------------
// Routes
// ---------------------------

app.use("/api", apiRoutes);
// Root path cho kiểm tra cơ bản
app.use("/", (req, res) => res.send('API Server is running. Check /api/sanphams.')); 

// ---------------------------
// 404 Handler
// ---------------------------
app.use((req, res, next) => {
  next(httpErrors(404, "Route not found"));
});

// ---------------------------
// Global Error Handler
// ---------------------------
app.use((err, req, res, next) => {
  logger.error(err);

  const status = err.status || 500;

  res.status(status).json({
    status,
    message: err.message || "Internal Server Error",
  });
});

// ---------------------------
// Start Server
// ---------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});