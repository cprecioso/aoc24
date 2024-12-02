import { TextLineStream } from "jsr:@std/streams@1.0.8";

export const readLines = async (path: URL | string) => {
  const file = await Deno.open(path, { read: true });

  const stream = file.readable
    .pipeThrough(new TextDecoderStream("utf-8"))
    .pipeThrough(new TextLineStream());

  return {
    [Symbol.dispose]() {
      file[Symbol.dispose]();
    },
    stream,
  };
};
