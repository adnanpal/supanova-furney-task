import type { FeedHealthData, HealthResponse, Run } from "../types/feedHealth";

export const API_BASE_URL = "http://localhost:3001";

export const ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  runs: `${API_BASE_URL}/api/runs`,
};

async function ensureOk(response: Response, endpoint: string): Promise<void> {
  if (response.ok) return;

  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? `GET ${endpoint} responded with ${response.status}`);
}

export async function fetchFeedHealth(signal?: AbortSignal): Promise<FeedHealthData> {
  const [healthResponse, runsResponse] = await Promise.all([
    fetch(ENDPOINTS.health, { signal }),
    fetch(ENDPOINTS.runs, { signal }),
  ]);

  await ensureOk(healthResponse, "/api/health");
  await ensureOk(runsResponse, "/api/runs");

  const health = (await healthResponse.json()) as HealthResponse;
  const runs = (await runsResponse.json()) as Run[];
  return { health, runs };
}
