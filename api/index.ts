import { createApp } from "../server";

const app = createApp();

export default function handler(req: any, res: any) {
  // On Vercel, rewrites from /api/(.*) to /api can set req.url to "/api"
  // The original requested route is stored in x-matched-path, x-forwarded-uri, or query
  const matchedPath =
    (req.headers["x-matched-path"] as string) ||
    (req.headers["x-forwarded-uri"] as string) ||
    (req.headers["x-original-url"] as string);

  if (matchedPath && matchedPath.startsWith("/api")) {
    const parsedUrl = new URL(req.url || "/", "http://localhost");
    const query = parsedUrl.search;
    req.url = matchedPath + (query && !matchedPath.includes("?") ? query : "");
  } else if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }

  // Fallback for root /api request
  if (req.url === "/api" || req.url === "/api/") {
    req.url = "/api/health";
  }

  return app(req, res);
}

