import { Application } from '@oak/oak';
import { inject } from './core/dependency-injection/inject.ts';
import { LogService } from './core/logging/log.ts';
import { PostgresModule } from './core/postgres/module.ts';
import { useRouter } from './core/router/router.ts';
import './modules/app-modules.ts';

const app = new Application();
const port = Number(Deno.env.get('HTTP_PORT') ?? 3000);
const logService = await inject(LogService);
const postgresModule = await inject(PostgresModule);

const onShutdown = async (): Promise<void> => {
  // To prevent the handler from being called twice,
  // we're removing the listener after the first call
  Deno.removeSignalListener('SIGINT', onShutdown);

  await postgresModule.destroy();

  logService.debug('Shutting down...');
  Deno.exit(0);
};

Deno.addSignalListener('SIGINT', onShutdown);

// Register router and routes - modifies `app`
await useRouter(app);

logService.debug(`Running server on http://localhost:${port}`);

await app.listen({ port });
