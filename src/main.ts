import { Application } from "@oak/oak/application";
import { router } from "./modules/router/router.ts";

const app = new Application();
const port = Number(Deno.env.get("HTTP_PORT") ?? 3000);

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Running server on http://localhost:${port}`);

app.listen({ port });
