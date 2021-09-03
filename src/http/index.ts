import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";

// const hot = (module as any).hot;

function handleRequest(
  targetRoute: string,
  handler: any,
  middlewares: any = {}
) {
  // console.log(middlewares);
  return function (req: Request, res: Response, next: Function) {
    (async () => {
      // await handler(req, res);
      // console.log(req.method);
      // console.log(targetRoute);
      // console.log(req.url);
      // console.log(handler);
      if (req.method in handler) {
        // console.log(req.method);
        const presets = middlewares[req.method] as any[];

        const handleMiddleware = (index: number) => {
          if (index > presets.length - 1)
            return async () => {
              await presets[index++](req, res);
            };

          return async () => {
            await presets[index](req, res, handleMiddleware(++index));
          };
        };

        if (!presets) await handler[req.method](req, res);
        else {
          presets.push(handler[req.method]);

          await handleMiddleware(0)();
        }

        /* if (presets) {
          for (const preset of presets) {
            await preset(req, res);
          }
        }

        await handler[req.method](req, res); */
      } else {
        res.status(404).end("route not found");
      }
    })().catch((err) => {
      console.log(err);
      // next(err)

      res.status(500).json({ error: err.message });
    });
  };
}

function findHandlers(baseDir: string, basePath: string) {
  let dirs = fs.readdirSync(path.resolve(baseDir), { withFileTypes: true });
  const router = Router({ mergeParams: true });

  dirs = dirs.sort((a, b) => {
    if (a.isDirectory() && b.isDirectory()) return 0;

    if (a.isDirectory() && !b.isDirectory()) return 1;

    let name1 = a.name.slice(0, a.name.length - 3);
    let name2 = b.name.slice(0, b.name.length - 3);

    if (!a.isDirectory() && !b.isDirectory()) {
      if (name1 === "index" && name2 === "index") return 0;

      if (name1 === "index" && name2 !== "index") return 1;
    }

    return -1;
  });

  // console.log(dirs);

  for (const dir of dirs) {
    if (dir.isDirectory()) {
      let name = dir.name;
      const isParam = name.startsWith("[") && name.endsWith("]");

      if (isParam) name = name.slice(1, name.length - 1);

      const route = isParam ? `/:${name}` : `/${name}`;

      const routes = findHandlers(
        path.resolve(baseDir, dir.name),
        `${basePath}${route}`
      );

      router.use(route, routes);

      // console.log(route);
    } else if (path.resolve(baseDir, dir.name) !== __filename) {
      const modulePath = path.resolve(baseDir, dir.name);
      const { get, post, put, del, middlewares } = require(modulePath);

      let name = dir.name.slice(0, dir.name.length - 3);
      const isParam = name.startsWith("[") && name.endsWith("]");

      if (isParam) name = name.slice(1, name.length - 1);

      const route = name === "index" ? "/" : isParam ? `/:${name}` : `/${name}`;
      const options = { GET: get, POST: post, PUT: put, DELETE: del };
      router.get(
        route,
        handleRequest(`${basePath}${route}`, options, middlewares)
      );
      router.post(
        route,
        handleRequest(`${basePath}${route}`, options, middlewares)
      );
      router.put(
        route,
        handleRequest(`${basePath}${route}`, options, middlewares)
      );
      router.delete(
        route,
        handleRequest(`${basePath}${route}`, options, middlewares)
      );
    }
  }

  return router;
}

export function httpRoutes() {
  const apiRouter = findHandlers(path.resolve(__dirname, "api"), "");

  // console.log(router.stack);

  return { apiRouter };
}
