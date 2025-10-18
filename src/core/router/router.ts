import { Application, Router } from '@oak/oak';
import { RouterRegistry } from './router-registry.ts';
import { inject } from '../dependency-injection/inject.ts';

export async function useRouter(app: Application): Promise<void> {
  const router = new Router();
  const routerRegistry = await inject(RouterRegistry);

  await routerRegistry.register(router);
  app.use(router.routes());
  app.use(router.allowedMethods());
}
