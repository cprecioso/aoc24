import { slidingWindows, zip } from "jsr:@std/collections@1.0.9";
import { readLines } from "../_shared/util/files.ts";
import { countStream, mapStream } from "../_shared/util/streams.ts";
import { check, checkWithDampen } from "./util.ts";

type Sign = -1 | 1;

const checkList = (list: readonly number[]) => {
  let listSign: Sign | undefined = undefined;

  for (const [a, b] of slidingWindows(list, 2)) {
    const diff = a - b;

    const sign = Math.sign(diff) as Sign;
    if (!listSign) listSign = sign;
    else if (sign !== listSign) return false;

    const delta = Math.abs(diff);
    const deltaAllowed = delta >= 1 && delta <= 3;
    if (!deltaAllowed) return false;
  }

  return true;
};

using lines = await readLines(new URL("./input.txt", import.meta.url));

const [safe, safeWithDampener] = await Promise.all(
  zip(
    lines.stream.tee(),
    [check, checkWithDampen],
  ).map(([linesStream, checkFn]) =>
    countStream(
      linesStream
        .pipeThrough(mapStream((line) => {
          const list = line
            .split(/\s/)
            .map((str) => Number.parseInt(str));

          return checkFn(list, checkList);
        })),
    )
  ),
);

console.log({
  safe,
  safeWithDampener,
});
