import { toTransformStream } from "jsr:@std/streams@1.0.8";

export const mapStream = <I, O>(
  fn: (input: I) => O,
) =>
  toTransformStream(async function* (src: ReadableStream<I>) {
    for await (const input of src) {
      yield await fn(input);
    }
  });
