import { readLines } from "../_shared/util/files.ts";
import { pairwise } from "../_shared/util/iterable.ts";

using lines = await readLines(new URL("./input.txt", import.meta.url));

let safe = 0;

type Sign = 0 | 1 | -1;

lineLoop: for await (const line of lines.stream) {
  const tuple = line
    .split(/\s/)
    .map((str) => Number.parseInt(str));

  let tupleDirection: Sign = 0;
  for (const [a, b] of pairwise(tuple)) {
    const diff = a - b;

    const currentDirection = Math.sign(diff);
    if (!tupleDirection) tupleDirection = currentDirection as Sign;
    else if (tupleDirection !== currentDirection) continue lineLoop;

    const delta = Math.abs(diff);
    if (!(delta >= 1 && delta <= 3)) continue lineLoop;
  }

  safe++;
}

console.log({ safe });
