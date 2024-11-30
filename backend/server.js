const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", scheduleRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
