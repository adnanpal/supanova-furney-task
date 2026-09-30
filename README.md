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
