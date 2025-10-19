import { HttpMethod } from '@oak/commons/method';
import { Callable } from '../../shared/types/callable.type.ts';
import { Ctor } from '../../shared/types/constructor.type.ts';
import { inject } from '../dependency-injection/inject.ts';
import { RouterRegistry } from './router-registry.ts';

const ROUTE_META = Symbol('__metadata:route__');
const routerRegistry = await inject(RouterRegistry);

type RouteMeta = {
  propertyKey: string | symbol;
  path?: string;
  method: HttpMethod;
};

// TODO(#5): Check if module name can be taken from context
export function Controller(
  prefix: string,
  opts?: { module?: string },
): Callable<void, [cls: Ctor, ctx: ClassDecoratorContext]> {
  return (cls: Ctor, ctx: ClassDecoratorContext) => {
    const metas: RouteMeta[] = (ctx.metadata as Record<symbol, RouteMeta[]>)[ROUTE_META] ?? [];

    for (const { propertyKey, path, method } of metas) {
      let fullPath = `${prefix}/${path ?? ''}`.replace('//', '/');

      if (!fullPath.startsWith('/')) {
        fullPath = `/${fullPath}`;
      }

      if (fullPath.endsWith('/')) {
        fullPath = fullPath.slice(0, -1);
      }

      routerRegistry.addRoute({
        classConstructor: cls,
        methodName: propertyKey,
        routePath: fullPath,
        method,
        module: opts?.module,
      });
    }
  };
}

type MethodDecorator = (value: Callable, ctx: ClassMethodDecoratorContext) => Callable;
type MethodDecoratorFactory = (path?: string) => MethodDecorator;

function createMethodDecorator(method: HttpMethod): MethodDecoratorFactory {
  return function (path?: string): MethodDecorator {
    return (value: Callable, ctx: ClassMethodDecoratorContext): Callable => {
      const proto = (ctx.metadata) as Record<symbol, RouteMeta[]>;

      if (!proto[ROUTE_META]) {
        proto[ROUTE_META] = [];
      }

      proto[ROUTE_META].push({ propertyKey: ctx.name, path, method });

      return value;
    };
  };
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');
