# typedffi

Easily create types for your Deno FFI functions _without any additional code_.

## Usage

Import the module from the Deno Third Party Modules hosting service:

```ts
import { dlopen } from "https://deno.land/x/typedffi/mod.ts";
```

After that, simply replace `Deno.dlopen` with our `dlopen` function.

> Note: `typedffi` doesn't change the behavior of `Deno.dlopen` with any special
> magic, so it still requires the `--unstable` flag to use.

## Example

Now, let's look at what `typedffi` can do for you without _any additional code_!

```ts
import { dlopen } from "https://deno.land/x/typedffi/mod.ts";

const lib = dlopen("YOUR_LIB", {
  add: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  long_async_crypto: {
    parameters: ["buffer", "u32"],
    result: "void",
    nonblocking: true,
  },
});

// You can now safely call `lib.symbols.add` while still having TypeScript
// typing for the function.

type AddFuncType = typeof lib.symbols.foo;
// (arg_0: number, arg_1: number) => number

// It even transforms the nonblocking functions types to be promises!

typeof lib.symbols.long_async_crypto;
// (arg_0: Uint8Array, arg_1: number) => Promise<void>
```

## License

[MIT](./LICENSE)
