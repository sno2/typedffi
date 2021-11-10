export type DeriveJSType<T extends "buffer" | Deno.NativeType> = {
  u8: number;
  i8: number;
  u16: number;
  i16: number;
  u32: number;
  i32: number;
  u64: number;
  i64: number;
  usize: number;
  isize: number;
  f32: number;
  f64: number;
  buffer: Uint8Array;
  void: void;
}[T];

export type DeriveJSTypeTuple<
  T extends readonly ("buffer" | Deno.NativeType)[],
  Draft extends readonly (number | Uint8Array | void)[] = [],
> = T["length"] extends 0 ? Draft
  : T extends readonly [infer $I, ...infer $R]
    ? $R extends readonly ("buffer" | Deno.NativeType)[]
      ? $I extends "buffer" | Deno.NativeType
        ? DeriveJSTypeTuple<$R, [...Draft, DeriveJSType<$I>]>
      : 1
    : 2
  : 3;

/** A better-typed wrapper over `Deno.dlopen`. */
export function dlopen<
  T extends {
    [K: string]: {
      parameters: readonly ("buffer" | Deno.NativeType)[];
      result: Deno.NativeType;
      nonblocking?: boolean;
    };
  },
>(
  file: string,
  f: T,
): {
  symbols: {
    [K in keyof T]: DeriveJSTypeTuple<T[K]["parameters"]> extends infer $P
      ? $P extends unknown[] ? (
        ...args: $P
      ) => DeriveJSType<T[K]["result"]> extends infer $R
        ? T[K]["nonblocking"] extends true ? Promise<$R>
        : $R
        : never
      : (...args: unknown[]) => unknown
      : never;
  };
  close(): void;
} {
  return Deno.dlopen(file, f as any) as any;
}

/**
 * @deprecated
 * @internal
 */
export const __COMPILE_ASSERT: {
  symbols: { hello: (...args: unknown[]) => unknown };
  close(): void;
} extends Deno.DynamicLibrary<{
  hello: { parameters: ["u8", "i32"]; result: "void"; nonblocking: true };
}> ? true
  : "this module is out of date with Deno's current typings, please send an issue to the repo" =
    true;
