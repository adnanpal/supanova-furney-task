Use this as the complete README.md:

# Supanova Feed Health

A small internal dashboard for monitoring feed freshness and ingestion health.

Built for the Supanova Labs build task.

## What it shows

The dashboard provides a quick overview of the supplied feed data:

- Number of healthy feeds
- Number of stale feeds
- Failed ingestion runs
- Configured freshness threshold
- Feed last-seen date
- Feed age in days
- Files seen by each feed
- Recent ingestion run history
- Unrouted items
- A "Needs attention" summary

The dashboard also highlights a product gap that a simple freshness threshold cannot catch: a feed can still be recent while its file volume is unusually low.

---

## Tech Stack

- React
- TypeScript
- Vite
- Node.js
- Express
- CSS

---

## Project Structure

```text
supanova-furney-task/
│
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   └── services/
│   │       └── feedHealth.ts
│   └── package.json
│
├── fixture/
│   ├── config.json
│   ├── run-log.jsonl
│   ├── signal-ledger.json
│   └── routing-hints.json
│
└── README.md
Installation
Requirements

Make sure you have installed:

Node.js
npm
Git

No database, API key, cloud service, or environment variables are required.

1. Clone the repository
git clone <your-repository-url>
cd supanova-furney-task
2. Install backend dependencies

Open a terminal in the project root:

cd server
npm install

Start the backend:

npm run dev

The backend will run on:

http://localhost:3001

You can verify it by opening:

http://localhost:3001/api/health

and:

http://localhost:3001/api/runs
3. Install frontend dependencies

Open a second terminal in the project root:

cd client
npm install

Start the frontend:

npm run dev

Vite will show a local URL, normally:

http://localhost:5173

Open that URL in your browser.

How It Works

The application follows this flow:

fixture/config.json
        │
fixture/run-log.jsonl
        │
        ▼
Node + Express
        │
        ├── GET /api/health
        │
        └── GET /api/runs
                │
                ▼
        React Frontend
                │
                ▼
        Feed Health Dashboard

The frontend does not import the fixture files directly.

The server reads the fixture data, calculates feed health, and exposes the results through API routes.

Feed Health

The freshness threshold is read from:

fixture/config.json

The supplied configuration uses a 3-day threshold.

Each feed is classified as:

Status	Meaning
Healthy	Last file is within the configured threshold
Stale	Last file is older than the configured threshold
Unknown	No last file is available

The dashboard displays:

Last file date
Age in days
Files seen
Current status
Reference time

The fixture contains historical data.

Instead of comparing the fixture against the computer's current date, the backend uses the latest ingestion run's started_at timestamp as the reference time.

This keeps the health calculation consistent with the supplied dataset.

Run History

The dashboard also displays recent ingestion runs.

Each run shows:

Run number
Start time
Status
Files seen
New items
Unrouted items

Failed runs and unrouted items are highlighted so they can be noticed quickly.

Needs Attention

The dashboard provides a short summary of issues that may require investigation.

For example:

1 feed is stale.
2 ingestion runs have failed historically.
Latest run has 1 unrouted item.

This allows the user to understand the current state without going through the complete run history.

Agent Watch

A freshness threshold only answers:

When did this feed last produce a file?

It does not answer:

Is the feed producing the amount of data we normally expect?

A feed could have a recent file while its volume has dropped significantly.

A future agent could therefore watch for:

Repeated zero-file runs
Unusually low file volume
Sudden drops from normal activity
Repeated ingestion anomalies

This would complement the existing freshness check instead of replacing it.

API
GET /api/health

Returns the calculated feed health.

Example:

{
  "referenceTime": "2026-09-04T06:05:00Z",
  "thresholdDays": 3,
  "feeds": [
    {
      "id": "granola",
      "lastSeen": "2026-09-04",
      "ageDays": 0,
      "filesSeen": 2,
      "status": "healthy"
    }
  ]
}
GET /api/runs

Returns the ingestion run history from the supplied fixture.

Design Decisions
No database

The task is read-only. The application only needs to read the fixture, calculate health, and display it, so a database would add unnecessary complexity.

Server-side fixture access

The browser does not access the fixture directly. The backend owns the data access and exposes only the required API responses.

Historical reference time

The latest run timestamp is used as the reference instead of the machine's current time because the fixture represents historical data.

Agent vs threshold

Instead of adding an unnecessary AI model, the agent requirement is addressed as a product capability: detecting abnormal feed volume is something an agent could monitor beyond a fixed freshness threshold.

Build

To verify the frontend build:

cd client
npm run build

To verify the backend build:

cd server
npm run build

Both should complete without errors.

Scope

The supplied fixture intentionally contains several data-quality anomalies.

This implementation focuses on the requested feed freshness and ingestion health problem rather than attempting to build a complete data-quality system for every anomaly in the fixture.

Time Spent

Approximately: [ADD ACTUAL TIME]


### One important thing

I've deliberately made the README explain **the actual user workflow**:

```text
Clone
 ↓
npm install in server
 ↓
npm run dev
 ↓
npm install in client
 ↓
npm run dev
 ↓
Open localhost:5173
 ↓
See feed health dashboard
