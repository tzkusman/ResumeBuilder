import { createApp } from "../server";

const app = createApp();

export default function handler(req: any, res: any) {
  let targetPath = "";

  // 1. Check for explicit __route rewrite from vercel.json
  if (req.query && req.query.__route) {
    const rawRoute = Array.isArray(req.query.__route)
      ? req.query.__route.join("/")
      : req.query.__route;
    targetPath = `/api/${rawRoute.replace(/^\/+/, "")}`;
    delete req.query.__route;
  } else {
    // 2. Check for Vercel forwarding headers
    const headerPath =
      (req.headers["x-matched-path"] as string) ||
      (req.headers["x-forwarded-uri"] as string) ||
      (req.headers["x-original-url"] as string) ||
      (req.headers["x-invoke-path"] as string);

    if (headerPath && headerPath.startsWith("/api")) {
      targetPath = headerPath;
    } else if (req.url && req.url.startsWith("/api")) {
      targetPath = req.url;
    } else if (req.url && req.url !== "/") {
      targetPath = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
    } else {
      targetPath = "/api";
    }
  }

  // Preserve query parameters without the internal __route token
  try {
    const parsed = new URL(req.url || "/", "http://localhost");
    if (parsed.search && !targetPath.includes("?")) {
      parsed.searchParams.delete("__route");
      const cleanSearch = parsed.searchParams.toString();
      if (cleanSearch) {
        targetPath += `?${cleanSearch}`;
      }
    }
  } catch {}

  req.url = targetPath;
  return app(req, res);
}
