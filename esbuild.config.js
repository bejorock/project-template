// import chokidar from "chokidar";
const chokidar = require("chokidar");
const esbuild = require("esbuild");
const rimraf = require("rimraf");

const { esbuildPluginDecorator } = require("esbuild-plugin-decorator");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

const esbuildOptions = {
  outdir: "dist",
  bundle: false,
  minify: false,
  platform: "node",
  format: "cjs",
  sourcemap: "inline",
  plugins: [
    nodeExternalsPlugin(),
    esbuildPluginDecorator({
      compiler: "swc",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
};

async function build(files_) {
  return await esbuild
    .build({
      target: "node12",
      entryPoints: files_,
      ...esbuildOptions,
    })
    .catch(() => process.exit(1));
}

rimraf.sync("dist");

// One-liner for current directory
let files = [];
chokidar
  .watch("./src")
  .on("all", (event, path) => {
    if (event === "add") files.push(path);
  })
  .on("ready", () => {
    build(files).then((r) => process.exit(0));
  });
