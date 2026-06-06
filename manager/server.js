const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Test DB connection
async function main() {
  await prisma.$connect();
  console.log("MongoDB Connected via Prisma");
}
main().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.send("Event Registration API is running...");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});