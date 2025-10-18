import { DependencyInjector } from './dependency-injector.ts';
import type { Ctor } from '../../shared/types/constructor.type.ts';

export async function inject<T>(token: Ctor<T>, module?: string): Promise<T> {
  return await DependencyInjector.resolve(token, module);
}
