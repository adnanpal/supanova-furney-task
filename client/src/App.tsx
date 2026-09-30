import { useEffect, useState } from "react";
import "./App.css";

type FeedHealth = {
  id: string;
  lastSeen: string | null;
  ageDays: number | null;
  filesSeen: number;
  status: "healthy" | "stale" | "unknown";
};

type HealthResponse = {
  referenceTime: string;
  thresholdDays: number;
  feeds: FeedHealth[];
};

type Run = {
  run: number;
  started_at: string;
  status: "ok" | "fail";
  error: string | null;
  counts: {
    seen: number;
    new: number;
    routed: number;
    unrouted: number;
  };
  feeds: Record<
    string,
    {
      last_file: string | null;
      files_seen: number;
    }
  >;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [healthResponse, runsResponse] = await Promise.all([
          fetch("http://localhost:3001/api/health"),
          fetch("http://localhost:3001/api/runs"),
        ]);

        if (!healthResponse.ok || !runsResponse.ok) {
          throw new Error("Failed to load feed health");
        }

        const healthData = await healthResponse.json();
        const runsData = await runsResponse.json();

        setHealth(healthData);
        setRuns(runsData);
      } catch {
        setError("Could not connect to the feed health server.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="page">Loading feed health...</div>;
  }

  if (error || !health) {
    return (
      <div className="page">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  const healthyCount = health.feeds.filter(
    (feed) => feed.status === "healthy"
  ).length;

  const staleCount = health.feeds.filter(
    (feed) => feed.status === "stale"
  ).length;

  const failedRuns = runs.filter((run) => run.status === "fail").length;

  const latestRun = runs[runs.length - 1];

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">INBOX / OPERATIONS</p>
          <h1>Feed health</h1>
          <p className="subtitle">
            Monitor whether incoming feeds are fresh and whether ingestion is
            running normally.
          </p>
        </div>

        <div className="reference">
          <span>Reference run</span>
          <strong>
            {new Date(health.referenceTime).toLocaleString()}
          </strong>
        </div>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Healthy feeds</span>
          <strong>{healthyCount}</strong>
        </div>

        <div className="summary-card warning">
          <span>Stale feeds</span>
          <strong>{staleCount}</strong>
        </div>

        <div className="summary-card">
          <span>Failed runs</span>
          <strong>{failedRuns}</strong>
        </div>

        <div className="summary-card">
          <span>Freshness threshold</span>
          <strong>{health.thresholdDays} days</strong>
        </div>
      </section>
      <section className="attention-banner">
  <div className="attention-icon">!</div>

  <div>
    <strong>Needs attention</strong>

    <p>
  {staleCount > 0 && (
    <>
      {staleCount} feed{staleCount > 1 ? "s are" : " is"} stale.{" "}
    </>
  )}

  {failedRuns > 0 && (
    <>
      {failedRuns} ingestion run{failedRuns > 1 ? "s have" : " has"} failed
      historically.{" "}
    </>
  )}

  {latestRun && latestRun.counts.unrouted > 0 && (
    <>
      Latest run has {latestRun.counts.unrouted} unrouted item
      {latestRun.counts.unrouted > 1 ? "s" : ""}.
    </>
  )}
</p>
  </div>
</section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Feeds</h2>
            <p>Last-seen freshness against the configured threshold.</p>
          </div>
        </div>

        <div className="feed-list">
          {health.feeds.map((feed) => (
            <article className="feed-card" key={feed.id}>
              <div className="feed-main">
                <div className={`status-dot ${feed.status}`} />

                <div>
                  <h3>{feed.id}</h3>

                  <p>
                    {feed.lastSeen
                      ? `Last file: ${formatDate(feed.lastSeen)}`
                      : "No file seen"}
                  </p>
                </div>
              </div>

              <div className="feed-metrics">
                <div>
                  <span>Age</span>
                  <strong>
                    {feed.ageDays === null ? "—" : `${feed.ageDays}d`}
                  </strong>
                </div>

                <div>
                  <span>Files</span>
                  <strong>{feed.filesSeen}</strong>
                </div>

                <span className={`status-badge ${feed.status}`}>
                  {feed.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Run history</h2>
            <p>Recent ingestion activity and failures.</p>
          </div>
        </div>

        <div className="run-table">
          <div className="run-row run-header">
            <span>Run</span>
            <span>Started</span>
            <span>Status</span>
            <span>Seen</span>
            <span>New</span>
            <span>Unrouted</span>
          </div>

          {runs
            .slice()
            .reverse()
            .slice(0, 10)
            .map((run) => (
              <div className="run-row" key={run.run}>
                <strong>#{run.run}</strong>

                <span>{formatDateTime(run.started_at)}</span>

                <span className={`status-badge ${run.status}`}>
                  {run.status}
                </span>

                <span>{run.counts.seen}</span>
                <span>{run.counts.new}</span>
                <span
                  className={
                    run.counts.unrouted > 0 ? "problem-value" : ""
                  }
                >
                  {run.counts.unrouted}
                </span>
              </div>
            ))}
        </div>
      </section>

      {latestRun && (
        <section className="agent-note">
          <div>
            <span className="note-label">Agent watch opportunity</span>
            <h2>Freshness alone can miss silent feed degradation.</h2>
            <p>
              A feed can have a recent last-seen timestamp while producing
              unusually few files. A future agent could compare recent volume
              against the feed's normal pattern and flag sustained drops or
              unexpected zero-file runs.
            </p>
          </div>
        </section>
        
      )}
    </main>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default App;