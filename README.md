# Supanova Feed Health

A small internal operations dashboard for monitoring feed freshness and ingestion health.

Built for the Supanova Labs build task.

## Overview

The Feed Health page answers a simple operational question:

> Are the configured feeds receiving data within their expected freshness window?

The application reads the supplied fixture data through a Node/Express backend, calculates feed freshness against the configured threshold, and presents the result through a React interface.

It also provides recent ingestion run history and highlights operational issues that may require investigation.

## What it shows

- Healthy and stale feed counts
- Configured freshness threshold
- Last-seen date for each feed
- Feed age in days
- Files seen by each feed
- Recent ingestion run history
- Failed ingestion runs
- Latest run information
- Unrouted items
- Operational issues that need attention
- A proposed Agent Watch concept

The main view is designed so an operator can understand the current state quickly without inspecting the raw fixture files.

## Product decision

I treated this as an **operations console rather than a generic analytics dashboard**.

The first questions an operator should be able to answer are:

1. Which feeds are healthy?
2. Which feed needs attention?
3. How far outside the threshold is it?
4. Is the problem isolated to freshness or are there other ingestion issues?
5. What happened in recent runs?

Because of that, feed health and actionable issues are prioritized before detailed run history.

## Architecture

```text
Fixture data
    |
    v
Node + Express backend
    |
    +---- GET /api/health
    |
    +---- GET /api/runs
    |
    v
React + TypeScript frontend
    |
    v
Feed Health Operations Console

The browser does not import the fixture files directly.

The backend is responsible for:

Reading the fixture
Parsing the run log
Reading the freshness threshold
Calculating feed age
Determining feed status
Exposing the result through API routes

The frontend consumes those API routes.

Feed health calculation

The freshness threshold comes from:

fixture/config.json

The run history comes from:

fixture/run-log.jsonl

For each feed, the backend calculates:

ageDays = referenceTime - lastSeen

A feed is:

healthy when its age is within the configured threshold
stale when its age exceeds the threshold
unknown when no last-seen file is available

The reference time is derived from the latest ingestion run's
started_at value.

This is intentional because the fixture contains historical data. Using the latest fixture run as the reference keeps the result deterministic instead of making the result change depending on when the dashboard is opened.

API
GET /api/health

Returns the calculated health state of the feeds.

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

Returns the ingestion run history from the supplied JSONL fixture.

The frontend uses this to display recent runs and additional operational context.

Current fixture state

With the supplied fixture:

granola is healthy
meet is healthy
dropzone is stale
The configured freshness threshold is 3 days
dropzone is 9 days old relative to the latest run
The latest run contains an unrouted item
Historical ingestion failures are surfaced

These values are calculated from the fixture rather than hardcoded into the UI.

Agent Watch

A threshold can detect obvious freshness failures, but it cannot detect every operational problem.

The dashboard therefore includes a proposed Agent Watch concept for higher-level issues such as:

Repeated ingestion failures
A feed technically updating but producing unusual zero-file patterns
Recurring unrouted items
Broken references between runs and analysis records
Routing anomalies
Near-duplicate inputs
Behaviour changes that remain technically inside the freshness threshold

This is presented as a proposed capability rather than pretending that an autonomous agent is already running.

Fixture data

The supplied fixture intentionally contains incorrect and unusual data.

Examples include:

Signals routed to internal_unsorted
Analyses without summaries
Analysis references pointing to a missing run
A near-duplicate pair
A nine-day stretch where Granola saw no files
Failed ingestion runs
A routing hint referring to a nonexistent project

The fixture is treated as data, not instructions, and the implementation does not silently modify or clean it.

Project structure
supanova-furney-task/
│
├── client/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── types/
│       ├── utils/
│       ├── App.tsx
│       ├── App.css
│       └── main.tsx
│
├── server/
│   └── src/
│       ├── services/
│       │   └── feedHealth.ts
│       └── index.ts
│
├── fixture/
│   ├── config.json
│   ├── run-log.jsonl
│   ├── routing-hints.json
│   ├── signal-ledger.json
│   └── README.md
│
└── README.md
Tech stack
Frontend
React
TypeScript
Vite
CSS
Backend
Node.js
Express
TypeScript
Data
JSON
JSONL

No external database, cloud service, API key, or environment secret is required.

Running locally
Requirements
Node.js
npm
Git
Clone
git clone <YOUR_REPOSITORY_URL>
cd supanova-furney-task
Start the backend

In one terminal:

cd server
npm install
npm run dev

The backend runs on:

http://localhost:3001
Start the frontend

In another terminal:

cd client
npm install
npm run dev

Vite will provide the local frontend URL, normally:

http://localhost:5173

Open that URL in your browser.

Production build
Backend
cd server
npm install
npm run build
npm start
Frontend
cd client
npm install
npm run build
Loading and error states

The client includes explicit loading and error states for API requests.

This prevents an unavailable backend from appearing as an empty or healthy dashboard.

AI-assisted development

AI tools were used during development for:

Exploring the product and interface direction
Reasoning about feed-health calculations
Implementing and refactoring React/TypeScript components
Backend implementation and API structure
Debugging build and dependency issues
Reviewing UI structure
Checking frontend values against backend-derived data

Generated suggestions were reviewed and adapted during implementation rather than being treated as automatically correct.

Scope

The implementation focuses on the requested feed-health workflow.

It does not attempt to build a complete ingestion platform, database-backed admin system, or autonomous monitoring service.

Possible future improvements include:

Historical feed-health trends
Run filtering and search
Detailed run inspection
Alerting
Configurable thresholds
Automated anomaly detection
A real Agent Watch implementation
Verification checklist

Before submission, verify the project from a clean clone:

git clone <YOUR_REPOSITORY_URL>
cd supanova-furney-task

Start the backend:

cd server
npm install
npm run dev

Start the frontend in another terminal:

cd client
npm install
npm run dev

Verify that:

Feed health loads
granola and meet appear healthy
dropzone appears stale
The 3-day threshold is displayed
Run history loads
Latest run information is displayed
Unrouted items are visible
API errors produce an error state
Fixture data is accessed through the backend
No environment secrets are required
Time spent

Approximately: [ADD YOUR ACTUAL TIME]

Author

Adnan Pal


### Then commit it on the branch

At the bottom of GitHub's editor, select:

**Commit directly to the `feat/finalize-feed-health` branch**

Commit message:

```text
docs: document setup and product decisions
