const next = require("next");
const path = require("path");

async function nextApp({ dev = true }) {
  // const dev = process.env.NODE_ENV !== "production";
  const app = next({ dev, dir: path.resolve(__dirname) });

  const handle = app.getRequestHandler();

  await app.prepare();

  return handle;
}

module.exports = nextApp;
