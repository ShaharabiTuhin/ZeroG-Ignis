const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const datasetContext = {
  ACME: {
    label: "Gaseous non-premixed flame",
    evidence: "128 experiments from s-Flame and BRE studies",
    signal: "soot accumulation",
  },
  FLEX: {
    label: "Liquid fuel combustion",
    evidence: "76 experiments on flame extinguishment boundaries",
    signal: "flammability margin",
  },
  BOTH: {
    label: "ACME and FLEX combustion evidence",
    evidence: "204 experiments across gaseous and liquid fuel studies",
    signal: "soot accumulation and flammability margin",
  },
};

function localSafetyAnswer({ query, dataset, isMicrogravity }) {
  const context = datasetContext[dataset] || datasetContext.ACME;
  const environment = isMicrogravity ? "microgravity" : "Earth baseline";
  const focus = isMicrogravity
    ? `In microgravity, reduced buoyancy can produce a wider, cooler flame and increase ${context.signal} risk.`
    : `On the Earth baseline, buoyancy produces a taller flame and faster upward transport of heat and products.`;

  return `For ${context.label} (${context.evidence}), assess the ${environment} profile while answering: "${query}". ${focus} Monitor temperature, flame spread, and ${context.signal}; keep the approved extinguishment procedure ready if any reading moves outside the observed range.`;
}

app.post("/api/analyze-flame", async (req, res) => {
  try {
    const { query, dataset = "ACME", isMicrogravity = true } = req.body;
    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({ error: "A safety question is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: localSafetyAnswer({
          query: query.trim(),
          dataset,
          isMicrogravity,
        }),
        source: "local-evidence",
      });
    }

    const context = datasetContext[dataset] || datasetContext.ACME;
    const environment = isMicrogravity ? "microgravity" : "Earth baseline";
    const prompt = `You are a NASA fire safety analyst and combustion research assistant. Answer the crew's question directly, even when it asks for an explanation, comparison, trend, cause, or recommendation. Use only the evidence context below, state when the data does not answer something, and never invent measurements or procedures. Keep the answer concise and readable in no more than 4 short paragraphs. Use bold labels only when they improve clarity.\nActive evidence scope: ${dataset} (${context.label}; ${context.evidence}; primary signal: ${context.signal})\nACME dataset: ${datasetContext.ACME.label}; ${datasetContext.ACME.evidence}; primary signal: ${datasetContext.ACME.signal}.\nFLEX dataset: ${datasetContext.FLEX.label}; ${datasetContext.FLEX.evidence}; primary signal: ${datasetContext.FLEX.signal}.\nEnvironment: ${environment}\nCrew question: ${query.trim()}`;

    const requestedModel = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const modelCandidates = [
      requestedModel,
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-lite-latest",
    ].filter((model, index, models) => models.indexOf(model) === index);
    let lastError;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return res.json({
          text: response.text(),
          source: "gemini",
          model: modelName,
        });
      } catch (error) {
        lastError = error;
        console.warn(
          `Gemini model ${modelName} failed; trying the next model.`,
        );
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.json({
      text: localSafetyAnswer({
        query: req.body?.query?.trim() || "the current flame profile",
        dataset: req.body?.dataset,
        isMicrogravity: req.body?.isMicrogravity !== false,
      }),
      source: "local-evidence-fallback",
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
