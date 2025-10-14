import { Application } from "@oak/oak";
import { useRouter } from "./modules/router/router.ts";
import "./modules/app-modules.ts";

const app = new Application();
const port = Number(Deno.env.get("HTTP_PORT") ?? 3000);

// Register router and routes - modifies `app`
useRouter(app);

console.log(`Running server on http://localhost:${port}`);

app.listen({ port });
