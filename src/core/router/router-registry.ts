import { Router } from '@oak/oak/router';
import { DependencyInjector } from '../dependency-injection/dependency-injector.ts';
import type { RegistryRoute } from './registry-route.type.ts';
import { LogService } from '../logging/log.ts';
import { Injectable } from '../dependency-injection/decorators.ts';

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

      switch (route.method) {
        case 'GET':
          router.get(route.routePath, async (ctx) => {
            ctx.response.body = await handler(ctx);
          });
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
