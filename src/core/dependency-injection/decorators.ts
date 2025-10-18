import { Callable } from '../../shared/types/callable.type.ts';
import { Ctor } from '../../shared/types/constructor.type.ts';
import { INJECTABLE_META } from './symbols.ts';

type ProviderScope = 'module' | 'global';

export type InjectionConfig = {
  dependencies?: (Ctor | { token: Ctor; module: string })[];
  scope?: ProviderScope;
  global?: boolean;
};

export function Injectable(
  config?: InjectionConfig,
): Callable<void, [cls: Ctor, ctx: ClassDecoratorContext]> {
  return (cls: Ctor, _ctx: ClassDecoratorContext): void => {
    const meta: InjectionConfig = {
      dependencies: config?.dependencies ?? [],
      scope: config?.scope ?? (config?.global ? 'global' : 'module'),
      global: !!config?.global,
    };

    Object.defineProperty(cls, INJECTABLE_META, {
      value: meta,
      configurable: true,
    });
  };
}
