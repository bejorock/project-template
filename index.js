require("source-map-support").install();

const express = require("express");
const http = require("http");
// const { createConnection } = require("typeorm");
const backend = require("./server");
const app = express();
// const ormConfig = require("./ormconfig");

(async () => {
  const mod = await backend({ dev: true });

  // await createConnection(ormConfig["default"]);

  app.use(`/api/v1`, (req, res) => {
    mod()
      .then((a) => {
        const { apiRouter } = a.httpRoutes();

        apiRouter(req, res);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("oops... internal server error");
      });
  });

  const httpServer = http.createServer(app);
  const port = 3001;

  httpServer.listen(port, () => {
    console.log(`server ready on port http://0.0.0.0:${port}`);
  });
})().catch((err) => {
  console.log(err);
  process.exit(0);
});
