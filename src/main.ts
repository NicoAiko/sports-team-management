import { Application } from '@oak/oak';
import { useRouter } from './core/router/router.ts';
import { PostgresClient } from './core/postgres/client.ts';
import './modules/app-modules.ts';
import { inject } from './core/dependency-injection/inject.ts';
import { LogService } from './core/logging/log.ts';

const app = new Application();
const port = Number(Deno.env.get('HTTP_PORT') ?? 3000);

Deno.addSignalListener('SIGINT', async () => {
  const postgresClient = inject(PostgresClient);
  const logService = inject(LogService);

  await postgresClient.destroy();

  logService.debug('Shutting down...');
  Deno.exit(0);
});

// Register router and routes - modifies `app`
useRouter(app);

inject(LogService).debug(`Running server on http://localhost:${port}`);

app.listen({ port });
