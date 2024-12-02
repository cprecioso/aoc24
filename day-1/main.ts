import { zip } from "jsr:@std/collections@1.0.9";
import { TextLineStream } from "jsr:@std/streams@1.0.8";
import { mapStream } from "./stream-util.ts";

const inputPath = new URL("./input.txt", import.meta.url);
using file = await Deno.open(inputPath, { read: true });

const [listA, listB] = await Promise.all(
  file.readable
    .pipeThrough(new TextDecoderStream("utf-8"))
    .pipeThrough(new TextLineStream())
    .pipeThrough(
      mapStream((line) =>
        line.split(/\s+/, 2).map((str) => Number.parseInt(str))
      ),
    )
    .tee()
    .map(async (stream, n) =>
      (await Array.fromAsync(
        stream.pipeThrough(mapStream((arr) => arr[n])),
      )).sort()
    ),
);

const sum = (a: number, b: number) => a + b;

const totalDistance = zip(listA, listB)
  .map(([elA, elB]) => Math.abs(elA - elB))
  .reduce(sum, 0);

const listBById = Map.groupBy(listB, (v) => v);

const totalSimilarity = listA
  .map((v) => v * (listBById.get(v)?.length ?? 0))
  .reduce(sum, 0);

console.log({ totalDistance, totalSimilarity });
