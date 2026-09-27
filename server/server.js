const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/analyze-flame", async (req, res) => {
  try {
    const { query, dataset } = req.body;
    // Basic prompt setup for your dashboard
    const prompt = `You are a NASA fire safety AI. Based on the ${dataset} microgravity combustion dataset, answer this astronaut query: ${query}. Keep it under 3 sentences.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
