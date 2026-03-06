const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
