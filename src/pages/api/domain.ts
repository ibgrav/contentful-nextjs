import { NextApiHandler } from "next";
import { getContentfulDomain } from "utils/contentful/domain-data";

const handler: NextApiHandler = async (_, res) => {
  const response = await getContentfulDomain();
  res.status(200).json(response);
};

export default handler;
