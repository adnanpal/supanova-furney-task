# Supanova Feed Health

A small internal feed-health dashboard built for the Supanova Labs build task.

The page answers two questions quickly:

1. Are the configured feeds fresh?
2. Is ingestion behaving normally?

The application reads the supplied fixture data through a Node/Express server and exposes health and run-history APIs to the React frontend.

---

## What I built

The application has two parts:

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + TypeScript + Vite

The backend reads:

- `fixture/config.json`
- `fixture/run-log.jsonl`

and exposes:

```text
GET /api/health
GET /api/runs

# Running locally
1. Clone the repository

git clone https://github.com/adnanpal/supanova-furney-task.git
cd supanova-furney-task

# 2. Start the backend
Open a terminal:
cd server
npm install
npm run dev

The backend runs at:
http://localhost:3001

Health endpoint:
http://localhost:3001/api/health

Run history:
http://localhost:3001/api/runs

# 3. Start the frontend
Open a second terminal:

cd client
npm install

Vite will provide the local frontend URL, normally:
http://localhost:5173
npm run dev
