import { FeedHealthConsole } from "./components/FeedHealth";

type AppProps = {
  /** "live" fetches /api/health and /api/runs; "sample" is for previewing without the backend. */
  dataSource?: "live" | "sample";
};

export function App({ dataSource = "live" }: AppProps) {
  return <FeedHealthConsole dataSource={dataSource} />;
}
