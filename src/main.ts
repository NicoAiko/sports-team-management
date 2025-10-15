import { Application } from "@oak/oak";
import { useRouter } from "./modules/router/router.ts";
import "./modules/app-modules.ts";
import { PostgresClient } from "./modules/postgres/client.ts";

const app = new Application();
const port = Number(Deno.env.get("HTTP_PORT") ?? 3000);

Deno.addSignalListener("SIGINT", async () => {
  await PostgresClient.destroy();

  console.log("Shutting down...");
  Deno.exit(0);
});

// Initialize Postgres Database connection
await PostgresClient.init();

// Register router and routes - modifies `app`
useRouter(app);

console.log(`Running server on http://localhost:${port}`);

app.listen({ port });
