require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const poolRoutes = require("./routes/poolRoutes");

app.use(express.json());

app.use("/pool", poolRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
