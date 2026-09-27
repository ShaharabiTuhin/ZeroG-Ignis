const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "zero-g-ignis" });
});

app.post("/api/analyze-flame", async (req, res) => {
  const { query, dataset = "ACME" } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "A flame-safety query is required." });
  }

  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_api_key_here"
  ) {
    return res
      .status(503)
      .json({ error: "Gemini API is not configured on the server." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = [
      "You are a NASA fire safety AI.",
      `Use the ${dataset} microgravity combustion dataset as context.`,
      `Answer this astronaut query in under 3 sentences: ${query}`,
    ].join(" ");
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate insights." });
  }
});

app.listen(port, () => {
  console.log(`ZeroG Ignis server running on port ${port}`);
});
