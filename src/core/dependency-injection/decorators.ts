import { Callable } from '../../shared/types/callable.type.ts';
import { Ctor } from '../../shared/types/constructor.type.ts';
import { INJECTABLE_META } from './symbols.ts';

export type InjectionConfig = {
  dependencies?: (Ctor | { token: Ctor; module: string })[];
  global?: boolean;
};

export function Injectable(
  config?: InjectionConfig,
): Callable<void, [cls: Ctor, ctx: ClassDecoratorContext]> {
  return (cls: Ctor, _ctx: ClassDecoratorContext): void => {
    const meta: InjectionConfig = {
      dependencies: config?.dependencies ?? [],
      global: !!config?.global,
    };

    Object.defineProperty(cls, INJECTABLE_META, {
      value: meta,
      configurable: true,
    });
  };
}
