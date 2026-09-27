# ZeroG Ignis

ZeroG Ignis is an interactive, AI-powered 3D dashboard designed to enhance astronaut fire safety for the NASA Space Apps Challenge 2026, "Flame in Freefall."

## Problem

Decades of NASA microgravity combustion data are dense and difficult for astronauts to interpret quickly during an emergency or mission planning.

## Solution

ZeroG Ignis uses machine learning concepts and the Gemini API to analyze complex microgravity combustion data. The frontend includes a real-time 3D visualization that compares flame behavior in microgravity and Earth gravity.

## Data Sources

- **ACME (Advanced Combustion via Microgravity Experiments):** Gaseous non-premixed flames, including s-Flame and BRE.
- **FLEX (Flame Extinguishment Experiment):** Liquid fuel combustion and flammability boundaries.

## Tech Stack

- Frontend: React, Vite, Three.js, React Three Fiber
- Backend: Node.js, Express
- AI/ML: Google Gemini API

## Project Structure

```text
client/   React dashboard
server/   Express API proxy for Gemini
 data/    Local ACME/FLEX datasets (not committed)
```

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173`.

### Backend

Create `server/.env` with your Gemini key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

Then run:

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

## API

`POST /api/analyze-flame`

```json
{
  "query": "What should I monitor during a flameout risk?",
  "dataset": "ACME"
}
```

Keep API keys in `server/.env`; never commit them to GitHub.
