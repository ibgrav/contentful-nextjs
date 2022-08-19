import { Entry, Environment } from "contentful-management";
import type { NextApiHandler } from "next";
import { CONTENTFUL_SPACE_ID } from "utils/constants/env";
import { createContentfulManagementClient } from "utils/contentful/create-client";

const handler: NextApiHandler = async (_, res) => {
  const client = createContentfulManagementClient();
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  const mapiSites = await env.getEntries({
    content_type: "isaacSite",
    "fields.slug": "mapi",
  });
  const mapiSite = mapiSites.items[0];

  // for await (let _ of Array(10).fill(0)) {
  await addNewSitePage(env, mapiSite);
  // }

  res.status(200).json({ done: true });
};

export default handler;

async function addNewSitePage(env: Environment, mapiSite: Entry) {
  const id = String(Date.now());

  const siteId = `mapi_site_${id}`;

  const site = await env.createEntryWithId("isaacSite", siteId, {
    fields: {
      title: { "en-US": `MAPI Site ${siteId}` },
      slug: { "en-US": siteId },
    },
    metadata: {
      tags: [{ sys: { type: "Link", linkType: "Tag", id: "mapi-tag" } }],
    },
  });

  console.log(`created ${siteId}`);

  await mapiSite.patch([
    {
      op: "add",
      path: "/fields/items/en-US",
      value: [
        ...mapiSite.fields.items?.["en-US"],
        {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: site.sys.id,
          },
        },
      ],
    },
  ]);

  // for await (let _ of Array(10).fill(0)) {
  //   await addTenPages(id, env, site);
  // }
}

async function addTenPages(id: string, env: Environment, site: Entry) {
  const pageId = `mapi_page_${id}`;

  const page = await env.createEntryWithId("isaacPage", pageId, {
    fields: {
      title: { "en-US": `MAPI Page ${pageId}` },
      slug: { "en-US": pageId },
    },
    metadata: {
      tags: [{ sys: { type: "Link", linkType: "Tag", id: "mapi-tag" } }],
    },
  });

  await site.patch([
    {
      op: "add",
      path: "/fields/items/en-US",
      value: [
        ...site.fields.items?.["en-US"],
        {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: page.sys.id,
          },
        },
      ],
    },
  ]);

  console.log(`added ${page.sys.id} to ${site.sys.id}`);
}
