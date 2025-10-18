import { HttpMethod } from '@oak/commons/method';
import { RouterRegistry } from './router-registry.ts';
import { Ctor } from '../../shared/types/constructor.type.ts';
import { Callable } from '../../shared/types/callable.type.ts';

const ROUTE_META = Symbol('__metadata:route__');

type RouteMeta = {
  propertyKey: string | symbol;
  path: string;
  method: HttpMethod;
};

// TODO: Check if module name can be taken from context
export function Controller(prefix: string, opts?: { module?: string }) {
  return (
    cls: Ctor,
    ctx: ClassDecoratorContext,
  ) => {
    const metas: RouteMeta[] =
      (ctx.metadata as Record<symbol, RouteMeta[]>)[ROUTE_META] ?? [];

    for (const { propertyKey, path, method } of metas) {
      let fullPath = `${prefix}${path}`;

      if (!fullPath.startsWith('/')) {
        fullPath = `/${fullPath}`;
      }

      if (fullPath.endsWith('/')) {
        fullPath = fullPath.slice(0, -1);
      }

      RouterRegistry.addRoute({
        classConstructor: cls,
        methodName: propertyKey,
        routePath: fullPath,
        method,
        module: opts?.module,
      });
    }
  };
}

function createMethodDecorator(method: HttpMethod) {
  return function (path: string) {
    return (
      value: Callable,
      context: ClassMethodDecoratorContext,
    ): Callable => {
      const proto = (context.metadata) as Record<symbol, RouteMeta[]>;

      if (!proto[ROUTE_META]) {
        proto[ROUTE_META] = [];
      }

      proto[ROUTE_META].push({ propertyKey: context.name, path, method });

      return value;
    };
  };
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');
