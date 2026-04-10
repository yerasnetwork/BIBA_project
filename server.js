import "dotenv/config";
import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const app = express();
app.use(express.json());

// Load the ask handler
const { default: askHandler } = await import("./api/ask.js");

app.post("/api/ask", askHandler);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/ask`);
});
