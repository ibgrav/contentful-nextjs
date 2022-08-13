import { NextApiHandler } from "next";
import { DOMAIN } from "utils/constants/env";
import { getDomainStaticPaths } from "utils/contentful/domain-paths";

const handler: NextApiHandler = async (_, res) => {
  const paths = await getDomainStaticPaths();

  res.status(200).end(paths.map((path) => `https://${DOMAIN}.hbs.edu/` + path.params.slug.join("/")).join("\n"));
};

export default handler;
