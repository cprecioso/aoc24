import { zip } from "jsr:@std/collections@1.0.9";
import { readLines } from "../_shared/util/files.ts";
import { mapStream } from "../_shared/util/streams.ts";

using lines = await readLines(new URL("./input.txt", import.meta.url));

const [listA, listB] = await Promise.all(
  lines.stream
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
