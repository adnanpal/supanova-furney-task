# Feed Health — Supanova Furney Task

An internal feed-health and ingestion monitoring dashboard built for the Supanova Inbox product.

The application helps an operator quickly understand whether ingestion feeds are healthy, identify stale or problematic feeds, inspect recent ingestion runs, and explore operational signals that a simple freshness threshold cannot detect.

---

## Overview

The main product question is:

> **What needs attention right now?**

The dashboard is designed so an operator can understand the current state of the ingestion system within a few seconds.

It provides:

- Feed freshness monitoring
- Healthy, stale, and unknown feed states
- Configurable freshness thresholds
- Ingestion run history
- Failed-run visibility
- Unrouted item visibility
- A prioritized "Needs Attention" section
- Run activity visualization
- Agent-watch insights beyond simple freshness checks
- Loading and error states

The application is intentionally read-only and does not modify the supplied fixture data.

---

## Key Features

### Feed Health

Each feed is evaluated against the configured freshness threshold.

The dashboard displays:

- Feed name
- Current status
- Last file seen
- Age of the latest file
- Number of files seen
- Freshness threshold

Feed states:

| Status | Meaning |
| --- | --- |
| Healthy | The feed is within the configured freshness threshold |
| Stale | The feed is older than the configured freshness threshold |
| Unknown | No usable `last_file` value is available |

The threshold is read from the supplied configuration rather than being hardcoded into the frontend.

---

### Needs Attention

The dashboard surfaces issues that require investigation instead of making the operator search through the complete run history.

The section can highlight:

- Stale feeds
- Failed ingestion runs
- Unrouted items
- Unknown feed states

For stale feeds, the UI provides useful context such as:

- Last seen date
- Current age
- Configured threshold
- How far the feed is beyond the threshold

This makes the issue actionable rather than simply reporting that something is wrong.

---

### Run History

The application displays ingestion run history from the backend.

Each run contains information such as:

- Run number
- Start time
- Status
- Items seen
- New items
- Routed items
- Unrouted items
- Feed-level information

Recent runs are displayed first so an operator can quickly understand recent ingestion activity.

Failed runs are visually distinguished from successful runs.

---

### Agent Watch

A freshness threshold is useful, but it cannot identify every type of ingestion problem.

For example:
> A feed can produce a file within the freshness window while still behaving abnormally.
The Agent Watch section explores what an automated agent could monitor in addition to freshness.

Potential signals include:

- Unusual drops in feed volume
- Unusual spikes in feed volume
- Repeated zero-item runs
- Recurring ingestion failures
- Persistent unrouted items
- Unexpected changes in feed behavior
- Correlated problems across multiple runs

This is intentionally presented as a **proposed capability**.
There is no automated AI agent running in the current implementation.

The distinction is:

```text
Freshness threshold
        ↓
"Did something arrive recently?"

Agent-level monitoring
        ↓
"Does the feed appear to be behaving normally?"

Architecture

The application uses a simple frontend/backend architecture.

                    Fixture Data
                         │
                         ▼
              ┌─────────────────────┐
              │   Node + Express    │
              │      Backend        │
              └──────────┬──────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        GET /api/health       GET /api/runs
              │                     │
              └──────────┬──────────┘
                         ▼
              ┌─────────────────────┐
              │   React Frontend    │
              │   TypeScript/Vite   │
              └─────────────────────┘
                         │
                         ▼
                  Feed Health UI
Data flow
The backend reads the supplied fixture files.
The backend parses the run history and configuration.
The backend calculates feed health.
The backend exposes the data through API routes.
The React frontend requests the API.
The frontend renders the health, attention, and run-history views.

The browser does not directly import the fixture JSON/JSONL files.

This keeps fixture access and health calculations behind the server boundary.

API
GET /api/health
Returns calculated feed health.

The response includes:

referenceTime
thresholdDays
feeds

Each feed contains:
id
lastSeen
ageDays
filesSeen
status

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
Returns the ingestion run history from the fixture.

The frontend uses this data to display:

Recent run history
Run status
Item counts
Failed runs
Unrouted items
Operational patterns
Feed Health Calculation

The freshness threshold is read from:

fixture/config.json

The backend uses the latest ingestion run as the reference point for calculating feed age.

For example:

Reference time:
September 4, 2026

Feed last seen:
August 26, 2026

Age:
9 days

Configured threshold:
3 days

Result:
STALE

The reference time comes from the latest fixture run rather than the machine's current clock.

This is intentional because the supplied fixture represents historical ingestion data. Using the latest fixture run as the reference keeps the calculation deterministic and reproducible.

Project Structure
supanova-furney-task/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentWatch.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── FeedHealth.tsx
│   │   │   ├── FeedTable.tsx
│   │   │   ├── IssueRow.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── NeedsAttention.tsx
│   │   │   ├── RunDetail.tsx
│   │   │   ├── RunHistory.tsx
│   │   │   ├── RunRow.tsx
│   │   │   ├── RunSequence.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── StatusIndicator.tsx
│   │   │   └── StatusSummary.tsx
│   │   │
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── postcss.config.js
│
├── server/
│   ├── src/
│   │   ├── services/
│   │   │   └── feedHealth.ts
│   │   └── index.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── fixture/
│   ├── config.json
│   ├── routing-hints.json
│   ├── run-log.jsonl
│   └── signal-ledger.json
│
└── README.md
Technology Stack
Frontend
React
TypeScript
Vite
CSS
Framer Motion
Lucide React
Backend
Node.js
Express
TypeScript
CORS
Data
JSON
JSONL

No database or external API is required.

Requirements

Before running the project, make sure you have:
Node.js 20+
npm

Check your versions:

node --version
npm --version
Installation

The project contains separate frontend and backend applications.

No external accounts, API keys, databases, or cloud services are required.

1. Clone the repository
git clone https://github.com/adnanpal/supanova-furney-task.git
cd supanova-furney-task
2. Install backend dependencies

From the project root:

cd server
npm install
3. Start the backend
npm run dev

The backend runs on:
http://localhost:3001

Available endpoints:

GET http://localhost:3001/api/health
GET http://localhost:3001/api/runs
Keep this terminal running.

4. Install frontend dependencies

Open a second terminal.
From the project root:

cd client
npm install
5. Start the frontend
npm run dev

Vite will provide a local development URL, normally:

http://localhost:5173

Open that URL in your browser.

Quick Start

Once dependencies are installed, only two terminals are required.

Terminal 1 — Backend
cd server
npm run dev
Terminal 2 — Frontend
cd client
npm run dev

Then open:

http://localhost:5173
Production Builds

Both applications can be built independently.

Frontend
cd client
npm run build
Backend
cd server
npm run build

The backend production build can then be started with:

npm start
Product Decisions
1. Optimize for a 10-second understanding

The information hierarchy is intentionally structured around:

Overall Health
      ↓
Needs Attention
      ↓
Feed Health
      ↓
Run History
      ↓
Agent Watch

An operator should not need to inspect every historical run just to determine whether something is wrong.

2. Freshness is treated as a state, not a progress bar

A feed is either within or outside its configured freshness threshold.

The UI therefore represents freshness using:

Status
Last seen date
Age
Threshold

rather than a progress bar.

3. Surface problems instead of hiding them

Stale feeds, failed runs, and unrouted items are surfaced in the "Needs Attention" section.

The operator can then move from the high-level issue to the underlying feed or run information.

4. Separate current functionality from future agent functionality

The Agent Watch section does not pretend that an AI agent currently exists.

Instead, it answers the product question:

What could an agent detect that a static freshness threshold cannot?

This keeps the current implementation honest while demonstrating how the monitoring system could evolve.

5. Keep fixture access on the server

The frontend does not directly import the fixture data.

The backend is responsible for:

Reading the fixture
Parsing the run log
Reading configuration
Calculating feed health
Exposing API routes

The frontend is responsible for presentation and interaction.

Fixture Data

The supplied fixture intentionally contains problematic data.

Examples include:

Unrouted signals
Analyses without summaries
Invalid analysis references
A near-duplicate pair
A period where a feed stopped seeing files
Failed ingestion runs
A routing hint referencing a nonexistent project

The fixture is treated as data and is not modified or cleaned by the application.

The current implementation focuses primarily on feed freshness and ingestion run health.

The additional fixture anomalies provide context for potential future monitoring capabilities.

Error and Loading States

The frontend includes dedicated states for:

Loading

Displayed while backend data is being fetched.

Error

Displayed when an API request fails or the backend is unavailable.

Unknown Data

Missing feed information is represented as an unknown state rather than assuming that missing data means the feed is healthy.

AI-Assisted Development

AI tools were used throughout development for implementation assistance, UI exploration, debugging, and iteration.

The workflow included:

Reasoning about the fixture structure and backend design
Assisting with React and TypeScript implementation
Exploring alternative frontend designs
Reviewing and adapting generated components to the existing API contract
Debugging Tailwind, PostCSS, React, and dependency issues
Verifying generated implementation against actual backend responses
Manually checking that displayed feed-health and run-history values matched the supplied fixture data

AI-generated code was treated as implementation assistance rather than as a source of truth.

Generated changes were reviewed, tested, and adapted to the requirements of the task.

The final implementation was manually reviewed to ensure that:

Backend routes match frontend usage
Feed-health calculations match the fixture
The frontend does not directly import fixture data
UI values correspond to backend responses
The implementation remains understandable and maintainable
Development Workflow

The project was developed incrementally:

Inspected the supplied fixture structure
Defined the feed-health calculation
Implemented the backend API
Connected the frontend to the API
Built the initial feed-health dashboard
Added operational attention states
Split the frontend into reusable components
Improved run-history visibility
Added the Agent Watch product concept
Iterated on the visual design
Debugged frontend dependency/configuration issues
Compared frontend values against backend responses
Refined the final interface
Documented the architecture and setup
Verification

The application should be verified from a clean environment before submission.

Backend
cd server
npm install
npm run build
npm run dev
Frontend

In a separate terminal:

cd client
npm install
npm run build
npm run dev

Then verify:

http://localhost:5173

The frontend should successfully retrieve:

/api/health
/api/runs

from the backend.

Scope

The implementation intentionally focuses on the core feed-health workflow rather than building a complete ingestion management platform.

The current project does not include:

Database persistence
User authentication
External integrations
Real-time ingestion
Automated remediation
A production AI monitoring agent
Cloud infrastructure

These are potential future extensions rather than requirements of the current implementation.

Future Improvements

If this were taken beyond the task, the next useful improvement would be establishing historical baselines for each feed.

Instead of only checking whether a feed is fresh, the system could learn or calculate expected:

File volume
Activity cadence
Failure frequency
Routing behavior

This would allow the system to detect situations such as:

Expected:
10–15 files/day

Actual:
1 file

Freshness:
Healthy

Behavior:
Abnormal

This is where an agent or anomaly-detection layer could provide value beyond a static freshness threshold.

Other possible improvements include:

Feed-level historical views
More detailed anomaly explanations
Automated notifications
Historical volume charts
Feed-specific baselines
Automated remediation workflows
Project Status

The core Feed Health workflow is complete.

The implementation currently provides:

Feed freshness calculation
Configurable freshness threshold
Backend API
Feed health visualization
Needs Attention section
Ingestion run history
Failed-run visibility
Unrouted-item visibility
Agent Watch product exploration
Loading and error states
Reusable frontend components
Local development setup
API-based fixture access
Time Spent

Approximately 10 hours, including implementation, UI iteration, debugging, testing, and documentation.
