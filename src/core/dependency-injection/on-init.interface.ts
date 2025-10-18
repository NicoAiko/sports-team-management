export interface OnInit {
  onInit(): void | Promise<void>;
}

// deno-lint-ignore no-explicit-any
export function implementsOnInit(instance: any): instance is OnInit {
  return 'onInit' in instance;
}
