const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const prisma = require("./config/prisma"); 

const app = express();

app.use(cors());
app.use(express.json());

async function main() {
  await prisma.$connect();
  console.log("MongoDB Connected via Prisma");
}
main().catch((err) => {
  console.error("Database connection error:", err);
  process.exit(1);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.get("/", (req, res) => res.send("Restaurant Management API is running..."));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);