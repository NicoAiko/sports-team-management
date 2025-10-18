import type { HttpMethod } from '@oak/commons/method';
import type { Ctor } from '../../shared/types/constructor.type.ts';

export type RegistryRoute = {
  classConstructor: Ctor;
  module?: string;
  method: HttpMethod;
  methodName: string | symbol;
  routePath: string;
};
