export class DIContainer {
  // deno-lint-ignore ban-types, no-explicit-any
  static #singletons = new Map<Function, any>();

  // deno-lint-ignore no-explicit-any
  public static register<T>(ctor: new (...args: any[]) => T, instance: T) {
    this.#singletons.set(ctor, instance);
  }

  // deno-lint-ignore no-explicit-any
  public static get<T>(ctor: new (...args: any[]) => T): T {
    if (!this.#singletons.has(ctor)) {
      // TODO: Add proper dependency injection
      const instance = new ctor();

      this.#singletons.set(ctor, instance);
    }

    return this.#singletons.get(ctor);
  }

  public static clear(): void {
    this.#singletons.clear();
  }
}
