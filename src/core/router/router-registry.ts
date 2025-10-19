import { isHttpError, type RouterContext } from '@oak/oak';
import { Router } from '@oak/oak/router';
import { Injectable } from '../dependency-injection/decorators.ts';
import { DependencyInjector } from '../dependency-injection/dependency-injector.ts';
import { LogService } from '../logging/log.ts';
import type { RegistryRoute } from './registry-route.type.ts';

@Injectable({ global: true, dependencies: [LogService] })
export class RouterRegistry {
  private routes: RegistryRoute[] = [];

  constructor(private readonly logService: LogService) {}

  public addRoute(route: RegistryRoute): void {
    this.routes.push(route);
  }

  public getRoutes(): RegistryRoute[] {
    return this.routes;
  }

  public async register(router: Router): Promise<void> {
    for (const route of this.routes) {
      // deno-lint-ignore no-explicit-any
      const instance = await DependencyInjector.resolve<any>(
        route.classConstructor,
        route.module,
      );
      const handler = instance[route.methodName].bind(
        instance,
      );

      const routeMiddleware = async (ctx: RouterContext<string>) => {
        try {
          ctx.response.body = await handler(ctx);
        } catch (error) {
          if (isHttpError(error)) {
            ctx.response.status = error.status;
            ctx.response.body = {
              status: error.status,
              message: error.message,
              name: error.name,
              error: error.cause,
            };
          } else {
            ctx.response.status = 500;
            ctx.response.body = {
              status: 500,
              message: 'An unexpected error occurred!',
              error: JSON.stringify(error),
            };
          }
        }
      };

      switch (route.method) {
        case 'GET':
          router.get(route.routePath, routeMiddleware);
          break;

        case 'POST':
          router.post(route.routePath, routeMiddleware);
          break;

        case 'PUT':
          router.put(route.routePath, routeMiddleware);
          break;

        case 'DELETE':
          router.delete(route.routePath, routeMiddleware);
          break;
      }

      this.logService.debug(
        `Route "${route.methodName.toString()} (${route.method} ${route.routePath})" has been registered`,
      );
    }

    this.logService.debug(
      `A total of ${this.routes.length} routes have been registered`,
    );
  }
}
