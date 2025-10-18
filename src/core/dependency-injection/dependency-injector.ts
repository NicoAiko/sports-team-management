import { Ctor } from '../../shared/types/constructor.type.ts';
import {
  DEFAULT_MODULE_NAME,
  GLOBAL_META,
  INJECTABLE_META,
} from './symbols.ts';
import { InjectionConfig } from './decorators.ts';
import { implementsOnInit } from './on-init.interface.ts';

export class DependencyInjector {
  static #modules = new Map<string | symbol, Set<Ctor>>();
  // deno-lint-ignore no-explicit-any
  static #moduleSingletons = new Map<string | symbol, Map<Ctor, any>>();
  // deno-lint-ignore no-explicit-any
  static #globalSingletons = new Map<Ctor, any>();

  public static registerModule(moduleName: string, providers: Ctor[]): void {
    if (!this.#modules.has(moduleName)) {
      this.#modules.set(moduleName, new Set());
    }

    // TODO: Check if we want to check here for duplicate module names so we can avoid registering multiple modules with the "same name"
    const set = this.#modules.get(moduleName)!;

    for (const item of providers) {
      set.add(item);
    }
  }

  public static registerGlobal(provider: Ctor): void {
    if (!this.#modules.has(GLOBAL_META)) {
      this.#modules.set(GLOBAL_META, new Set());
    }

    this.#modules.get(GLOBAL_META)!.add(provider);
  }

  public static clear() {
    this.#modules.clear();
    this.#moduleSingletons.clear();
    this.#globalSingletons.clear();
  }

  public static async resolve<T>(
    token: Ctor<T>,
    moduleName?: string,
  ): Promise<T> {
    const meta =
      (token as unknown as Record<symbol, InjectionConfig | undefined>)[
        INJECTABLE_META
      ];
    const scope = meta?.scope ?? 'module';

    if (scope === 'global') {
      if (this.#globalSingletons.has(token)) {
        return this.#globalSingletons.get(token);
      }

      const instance = await this.instantiate(token, moduleName);

      this.#globalSingletons.set(token, instance);

      return instance;
    }

    // Module Scope
    const effectiveModule = moduleName ?? DEFAULT_MODULE_NAME;

    if (!this.#moduleSingletons.has(effectiveModule)) {
      this.#moduleSingletons.set(effectiveModule, new Map());
    }

    const map = this.#moduleSingletons.get(effectiveModule)!;

    if (map.has(token)) {
      return map.get(token);
    }

    const instance = await this.instantiate(token, moduleName);

    map.set(token, instance);

    return instance;
  }

  private static async instantiate<T>(
    ctor: Ctor<T>,
    moduleName?: string,
  ): Promise<T> {
    const meta =
      (ctor as unknown as Record<symbol, InjectionConfig | undefined>)[
        INJECTABLE_META
      ];
    const dependencies = meta?.dependencies ?? [];

    const resolvedDependencies = await Promise.all(
      dependencies.map((dependencyToken) => {
        if (
          dependencyToken && typeof dependencyToken === 'object' &&
          ('token' in dependencyToken)
        ) {
          return DependencyInjector.resolve(
            dependencyToken.token,
            dependencyToken.module,
          );
        }

        return DependencyInjector.resolve(dependencyToken, moduleName);
      }),
    );

    const instance = new ctor(...resolvedDependencies);

    if (implementsOnInit(instance)) {
      await instance.onInit();
    }

    return instance;
  }
}
