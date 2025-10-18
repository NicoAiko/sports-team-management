// deno-lint-ignore no-explicit-any
export type Callable<T extends any = any, U extends any[] = any[]> = (
  ...args: U
) => T;
