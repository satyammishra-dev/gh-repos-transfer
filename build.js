// build.js
import * as esbuild from "esbuild";
import { chmod } from "node:fs/promises";

async function build() {
  // Bundle the application
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: "./esbuild/index.cjs",
    banner: {
      js: "#!/usr/bin/env node\n",
    },
    minify: true,
    external: [
      "crypto",
      "fs",
      "path",
      "os",
      "http",
      "https",
      "stream",
      "util",
      "url",
      "net",
      "tls",
      "zlib",
      "events",
      "dns",
      "tty",
      "buffer",
      "string_decoder",
      "querystring",
      "assert",
    ],
  });

  // Make the output file executable
  await chmod("./esbuild/index.cjs", 0o755);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
