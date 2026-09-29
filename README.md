# ZeroG Ignis

ZeroG Ignis is an interactive, AI-powered 3D dashboard designed to enhance astronaut fire safety for the NASA Space Apps Challenge 2026, "Flame in Freefall."

**Live demo:** https://zerog-ignis.vercel.app/

## Problem

Decades of NASA microgravity combustion data are dense and difficult for astronauts to interpret quickly during an emergency or mission planning.

## Solution

ZeroG Ignis uses the Gemini API to analyze complex microgravity combustion data. The dashboard includes a real-time 3D visualization that compares flame behavior in microgravity and Earth gravity, navigation between safety sections, and formatted analyst responses.

## Data Sources

- **ACME (Advanced Combustion via Microgravity Experiments):** Gaseous non-premixed flames, including s-Flame and BRE.
- **FLEX (Flame Extinguishment Experiment):** Liquid fuel combustion and flammability boundaries.
- The analyst can focus on **ACME**, **FLEX**, or **BOTH** for cross-dataset comparisons.

## Tech Stack

- Frontend: React, Vite, Three.js, React Three Fiber
- Backend: Node.js, Express
- AI/ML: Google Gemini API

## Project Structure

```text
client/   React dashboard
server/   Express API proxy for Gemini
data/     Local ACME/FLEX datasets (not committed)
vercel.json  Vercel multi-service routing
```

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

For local development, set the API URL before starting Vite:

```bash
printf 'VITE_API_URL=http://localhost:5001\n' > .env.local
```

The dashboard runs at `http://localhost:5173`.

### Backend

Create `server/.env` with your Gemini key:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5001
```

Then run:

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5001`.

## API

`POST /api/analyze-flame`

```json
{
  "query": "What should I monitor during a flameout risk?",
  "dataset": "BOTH",
  "isMicrogravity": true
}
```

The `dataset` value can be `ACME`, `FLEX`, or `BOTH`. Gemini can answer evidence-based explanations, comparisons, trends, causes, and safety recommendations. Responses may include formatted evidence and recommendation sections.

Keep API keys in `server/.env`; never commit them to GitHub.

## Vercel Deployment

The root `vercel.json` configures two services in one Vercel project:

- `client`: Vite frontend, publicly routed at `/`
- `server`: Express API, publicly routed through `/api/*`

No service binding is required because the browser uses the public `/api` rewrite and the server calls Gemini externally.

Import the repository into Vercel and set these server environment variables:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Keep production secrets in Vercel Environment Variables.
