import { assert } from "jsr:@std/assert@1.0.6";
import { toTransformStream } from "jsr:@std/streams@1.0.8";
import { addIfTrue } from "./math.ts";

export const mapStream = <I, O>(
  fn: (input: I) => O,
) =>
  toTransformStream(async function* (src: AsyncIterable<I>) {
    for await (const input of src) {
      yield await fn(input);
    }
  });

export const reduceStream = async <I, O>(
  src: AsyncIterable<I>,
  initial: O,
  fn: (acc: O, item: I) => O,
) => {
  let acc = initial;
  for await (const item of src) {
    acc = fn(acc, item);
  }
  return acc;
};

export const countStream = (src: AsyncIterable<boolean>) =>
  reduceStream(src, 0, addIfTrue);

export const supertee = <T>(
  stream: ReadableStream<T>,
  qty: number,
) => {
  assert(Number.isInteger(qty));
  assert(qty >= 0);

  if (qty === 0) return [];
  if (qty === 1) return [stream];

  return Array.from({ length: qty - 1 }).reduce<ReadableStream<T>[]>(
    ([last, ...rest]) => [...last.tee(), ...rest],
    [stream],
  );
};
