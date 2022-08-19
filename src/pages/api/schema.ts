import { NextApiHandler } from "next";
import { CONTENTFUL_SPACE_ID } from "utils/constants/env";
import { createContentfulManagementClient } from "utils/contentful/create-client";

const client = createContentfulManagementClient();

const handler: NextApiHandler = async (_, res) => {
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");
  const types = await env.getContentTypes();

  //   const new_type = await env.createContentTypeWithId("isaacNewType", {
  //     name: "New Type",
  //     fields: [
  //       {
  //         id: "title",
  //         name: "Title",
  //         type: "Text",
  //         required: true,
  //         localized: false,
  //       },
  //     ],
  //   });

  res.status(200).json({ types });
};

export default handler;
