// import chokidar from "chokidar";
const chokidar = require("chokidar");
const esbuild = require("esbuild");
const rimraf = require("rimraf");
const nodePath = require("path");
const { createConnection } = require("typeorm");

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
      verbose: false,
    }),
  ],
  incremental: true,
};

async function build(files_) {
  console.log("building files...");

  return await esbuild
    .build({
      target: "node12",
      entryPoints: files_.filter((f) => f.endsWith(".ts")),
      ...esbuildOptions,
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}

// One-liner for current directory
let ready = false;
let files = [];
let builder = null;
let isReload = false;
let reloadCause = null;

async function server({ dev = true }) {
  if (dev) {
    await new Promise((resolve, reject) => {
      chokidar
        .watch("./src")
        .on("all", (event, path) => {
          if (event === "add") files.push(path);
          else if (event === "change" && builder) {
            /* Object.keys(require.cache).forEach((k) => {
              const relativePath = nodePath.relative(__dirname, k);

              if (relativePath.startsWith("dist")) {
                delete require.cache[require.resolve(k)];
              }
            });

            isReload = true; */
          } else if (event === "unlink") {
            files = files.filter((f) => f !== path);
            rimraf.sync(path.replace("src", "dist").replace("ts", "js"));
          }

          if (
            (event === "add" || event === "unlink" || event === "change") &&
            builder
          ) {
            reloadCause = event;
            isReload = true;
          }
          // build(files).then((r) => (builder = r));
        })
        .on("ready", () => {
          ready = true;

          build(files)
            .then((r) => (builder = r))
            .then(() => resolve(true));
        })
        .on("error", (err) => reject(err));
    });
  }

  const ormConfig = require("./ormconfig");
  let conn = await createConnection(ormConfig["default"]).then((conn) => {
    console.log("load connection...");

    return conn;
  });

  console.log("load server module...");

  return async () => {
    // console.log("reload module");
    if (isReload) {
      console.log("reload server module...");
      await conn.close().then(() => console.log("close connection..."));

      /* console.log(reloadCause);
      if (reloadCause === "change")
        await builder.rebuild().then(() => "do rebuild only");
      else */
      await build(files)
        .then((r) => (builder = r))
        .then(() => console.log("recompile typescript files..."));

      Object.keys(require.cache).forEach((k) => {
        const relativePath = nodePath.relative(__dirname, k);

        if (relativePath.startsWith("dist")) {
          delete require.cache[require.resolve(k)];
        }
      });

      delete require.cache[require.resolve("./ormconfig")];

      const ormConfig = require("./ormconfig");
      conn = await createConnection(ormConfig["default"]).then((conn) => {
        console.log("reload connection...");
        return conn;
      });

      // delete require.cache[require.resolve("./dist/index")];
      isReload = false;
    }

    return require("./dist/index");
  };
}

module.exports = server;
