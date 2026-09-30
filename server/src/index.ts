import express from "express";
import cors from "cors";
import { getFeedHealth, getRunHistory } from "./services/feedhealth";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  try {
    const health = getFeedHealth();
    res.json(health);
  } catch (error) {
    console.error("Failed to calculate feed health:", error);

    res.status(500).json({
      error: "Failed to calculate feed health",
    });
  }
});

app.get("/api/runs", (_req, res) => {
  try {
    const runs = getRunHistory();
    res.json(runs);
  } catch (error) {
    console.error("Failed to read run history:", error);

    res.status(500).json({
      error: "Failed to read run history",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});