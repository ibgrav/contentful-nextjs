import type { NextApiHandler } from "next";

const healthHandler: NextApiHandler<string> = (_, res) => {
  res.status(200).end("ok");
};

export default healthHandler;
