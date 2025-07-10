const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());

connectDB();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/receive-bet", (req, res) => {
  const payload = req.body;
  console.log("📦 Received payload from Puppeteer:", payload);
  
  // TODO: Save to DB or trigger other actions

  res.status(200).json({ message: "✅ Payload received" });
});

app.use("/api/user", require("./routes/user"));


app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
