// deno-lint-ignore-file no-explicit-any

import { dlopen } from "./mod.ts";

(globalThis as any).lib = { symbols: {} };
const symbols = (globalThis as any).lib.symbols as Record<string, unknown>;

symbols.simple = () => {};
symbols.easy = () => {};
symbols.medium = () => {};
symbols.hard1 = () => {};
symbols.hard2 = () => {};
symbols.extreme = () => {};

const data = () =>
  dlopen(
    "",
    {
      simple: {
        parameters: [],
        result: "void",
      },
      easy: {
        parameters: ["f32", "buffer", "i16"],
        result: "void",
      },
      medium: {
        parameters: ["f32", "i16", "usize", "buffer"],
        result: "u16",
      },
      hard1: {
        parameters: ["f32", "f64"],
        result: "void",
        nonblocking: false,
      },
      hard2: {
        parameters: ["buffer"],
        result: "f32",
        nonblocking: true,
      },
      extreme: {
        parameters: ["buffer"],
        result: "void",
        nonblocking: true,
      },
    } as const,
  );

declare const lib: ReturnType<typeof data>;

const _v0: void = lib.symbols.simple();
const _v1: void = lib.symbols.easy(2, new Uint8Array(), 2);
const _v2: number = lib.symbols.medium(2, 3, 4, new Uint8Array());
const _v3: void = lib.symbols.hard1(2, 3);
const _v4: Promise<number> = lib.symbols.hard2(new Uint8Array());
const _v5: Promise<void> = lib.symbols.extreme(new Uint8Array());
