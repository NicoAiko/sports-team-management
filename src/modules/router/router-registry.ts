import { Router } from "@oak/oak/router";
import { HttpMethod } from "@oak/commons/method";
import { DIContainer } from "../../dependency-injection-container.ts";

type RegistryRoute = {
  // deno-lint-ignore ban-types
  classConstructor: Function;
  method: HttpMethod;
  path: string;
  name: string | symbol;
};

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
    if (this.#isRegistered) {
      // TODO: Log that routes are already registered!

      throw new Error("Attempt to register routes twice!");
    }

    this.#routes.forEach((route) => {
      // deno-lint-ignore no-explicit-any
      const instance = DIContainer.get(route.classConstructor as any);
      // deno-lint-ignore no-explicit-any
      const handler = (instance as any)[route.name]
        .bind(instance);

      switch (route.method) {
        case "GET":
          router.get(route.path, async (ctx) => {
            ctx.response.body = await handler(ctx);
          });
          break;
      }

      // TODO: Log here (debug) that route XYZ has been registered
      console.log(
        `Route "${route.name.toString()} (${route.method} ${route.path})" has been registered`,
      );
    });

    // TODO: Log here (debug) that (amount) routes have been registered
    console.log(`A total of ${this.#routes.length} have been registered`);

    this.#isRegistered = true;
  }
}
