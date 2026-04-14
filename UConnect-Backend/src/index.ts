import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bootstrapDatabase } from "./db/bootstrap";
import adminRoute from "./routes/admin.route";
import { requireEnv, requireEnvNumber } from "./config/env";
import publicRoute from "./routes/public.route";

const app = new Hono();
const FRONTEND_ORIGIN = requireEnv("FRONTEND_ORIGIN");
const PORT = requireEnvNumber("PORT");
const PUBLIC_BASE_URL = requireEnv("PUBLIC_BASE_URL");

app.use(
  "*",
  cors({
    origin: FRONTEND_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "x-admin-key"],
    maxAge: 600,
    credentials: true,
  }),
);

app.get("/", (context) =>
  context.json({ service: "UConnect API", status: "ok" }, 200),
);
app.get("/api/health", (context) => context.json({ status: "healthy" }, 200));

app.route("/api", publicRoute);
app.route("/api/admin", adminRoute);

async function startServer() {
  await bootstrapDatabase();

  serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    (info) => {
      console.log(
        `UConnect API running at ${PUBLIC_BASE_URL} (port ${info.port})`,
      );
    },
  );
}

startServer().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});
