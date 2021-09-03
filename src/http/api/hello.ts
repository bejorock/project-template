import { Request, Response } from "express";

export async function get(req: Request, res: Response) {
  res.send("hello world 2");
}
