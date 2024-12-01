import { zip } from "jsr:@std/collections@1.0.9";
import { TextLineStream } from "jsr:@std/streams@1.0.8";
import { mapStream } from "./stream-util.ts";

const inputPath = new URL("./input.txt", import.meta.url);
using file = await Deno.open(inputPath, { read: true });

const lists = await Promise.all(
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

const totalDistance = zip(...lists)
  .map(([elA, elB]) => Math.abs(elA - elB))
  .reduce((acc, value) => acc + value);

console.log(totalDistance);
