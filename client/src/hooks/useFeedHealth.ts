import { useCallback, useEffect, useState } from "react";
import { sampleFeedHealth } from "../data/sampleFeedHealth";
import { fetchFeedHealth } from "../utils/api";
import type { DataSource, FeedHealthData } from "../types/feedHealth";

type LoadState = {
  status: "loading" | "ready" | "error";
  data: FeedHealthData | null;
  error: string | null;
  fetchedAt: Date | null;
  refreshing: boolean;
};

export function useFeedHealth(source: DataSource) {
  const [state, setState] = useState<LoadState>({
    status: "loading",
    data: null,
    error: null,
    fetchedAt: null,
    refreshing: false,
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({
      ...s,
      status: s.data ? "ready" : "loading",
      refreshing: s.data !== null,
      error: null,
    }));

    const load =
      source === "sample"
        ? new Promise<FeedHealthData>((resolve) => setTimeout(() => resolve(sampleFeedHealth), 350))
        : fetchFeedHealth(controller.signal);

    load
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", data, error: null, fetchedAt: new Date(), refreshing: false });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setState((s) => ({
          ...s,
          status: s.data ? "ready" : "error",
          error: message,
          refreshing: false,
        }));
      });

    return () => controller.abort();
  }, [source, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, refresh };
}
