import { Router } from '@oak/oak/router';
import { DependencyInjector } from '../dependency-injection/dependency-injector.ts';
import type { RegistryRoute } from './registry-route.type.ts';
import { inject } from '../dependency-injection/inject.ts';
import { LogService } from '../logging/log.ts';

export class RouterRegistry {
  static #routes: RegistryRoute[] = [];
  static #isRegistered: boolean = false;

  public static addRoute(route: RegistryRoute): void {
    this.#routes.push(route);
  }

  public static getRoutes(): RegistryRoute[] {
    return this.#routes;
  }

  public static register(router: Router): void {
    const logService = inject(LogService);

    if (this.#isRegistered) {
      logService.error(`Attemted to register routes twice!`);

      throw new Error('Attempt to register routes twice!');
    }

    this.#routes.forEach((route) => {
      // deno-lint-ignore no-explicit-any
      const instance = DependencyInjector.resolve<any>(
        route.classConstructor,
        route.module,
      );
      const handler = instance[route.methodName].bind(
        instance,
      );

      switch (route.method) {
        case 'GET':
          router.get(route.routePath, async (ctx) => {
            ctx.response.body = await handler(ctx);
          });
          break;
      }

      logService.debug(
        `Route "${route.methodName.toString()} (${route.method} ${route.routePath})" has been registered`,
      );
    });

    logService.debug(
      `A total of ${this.#routes.length} routes have been registered`,
    );

    this.#isRegistered = true;
  }
}
