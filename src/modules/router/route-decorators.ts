import { HttpMethod } from "@oak/commons/method";
import { RouterRegistry } from "./router-registry.ts";

const ROUTE_META = Symbol("__metadata:route__");

type RouteMeta = {
  propertyKey: string | symbol;
  path: string;
  method: HttpMethod;
};

export function Controller(prefix: string) {
  // deno-lint-ignore no-explicit-any
  return <T extends { new (...args: any[]): any }>(
    cls: T,
    ctx: ClassDecoratorContext,
  ) => {
    // deno-lint-ignore no-explicit-any
    const metas: RouteMeta[] = (ctx.metadata as any)[ROUTE_META] ?? [];

    for (const { propertyKey, path, method } of metas) {
      let fullPath = `${prefix}${path}`;

      if (!fullPath.startsWith("/")) {
        fullPath = `/${fullPath}`;
      }

      if (fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
      }

      RouterRegistry.addRoute({
        classConstructor: cls,
        name: propertyKey,
        path: fullPath,
        method,
      });
    }
  };
}

function createMethodDecorator(method: HttpMethod) {
  return function (path: string) {
    // deno-lint-ignore no-explicit-any, ban-types
    return (value: Function, context: ClassMethodDecoratorContext): any => {
      // deno-lint-ignore no-explicit-any
      const proto = (context.metadata) as any;

      if (!proto[ROUTE_META]) {
        proto[ROUTE_META] = [];
      }

      proto[ROUTE_META].push({ propertyKey: context.name, path, method });

      return value;
    };
  };
}

export const Get = createMethodDecorator("GET");
export const Post = createMethodDecorator("POST");
export const Put = createMethodDecorator("PUT");
export const Delete = createMethodDecorator("DELETE");
