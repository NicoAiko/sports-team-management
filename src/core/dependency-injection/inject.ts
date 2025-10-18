import { DependencyInjector } from './dependency-injector.ts';
import type { Ctor } from '../../shared/types/constructor.type.ts';

export function inject<T>(token: Ctor<T>, module?: string): T {
  return DependencyInjector.resolve(token, module);
}
