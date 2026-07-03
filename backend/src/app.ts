import express = require("express");
import cors = require("cors");

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

export default app;