import { Application, Router } from '@oak/oak';
import { RouterRegistry } from './router-registry.ts';

export function useRouter(app: Application): void {
  const router = new Router();

  RouterRegistry.register(router);

  app.use(router.routes());
  app.use(router.allowedMethods());
}
