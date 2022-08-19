import { Asset, Entry } from "contentful";
import type { Contentful } from "types/contentful";
import { DOMAIN } from "utils/constants/env";
import { createContentfulClient } from "./create-client";

export async function getContentfulDomain() {
  const client = createContentfulClient({ draft: true });

  const domains = await client.withoutUnresolvableLinks.getEntries<Contentful.Domain>({
    limit: 1,
    include: 10,
    content_type: "isaacDomain",
    "fields.title": DOMAIN,
  });

  return {
    domain: domains.items[0] as Entry<Contentful.Domain>,
    refs: {
      Entry: domains.includes?.Entry || [],
      Asset: domains.includes?.Asset || [],
    } as Contentful.Includes,
  };
}
