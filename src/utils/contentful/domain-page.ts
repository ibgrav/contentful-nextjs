import { Entry } from "contentful";
import { Contentful } from "types/contentful";
import { DOMAIN } from "utils/constants/env";
import { createContentfulClient } from "./create-client";

export async function getContentfulPage(path: string[]) {
  const client = createContentfulClient({ draft: true });

  const domains = await client.getEntries<Contentful.Domain>({
    limit: 1,
    include: 10,
    content_type: "isaacDomain",
    "fields.title": DOMAIN,
  });

  const domain = domains.items[0];
  const site = domain.fields.site;

  return findPage(path, [], site.fields.items);
}

function findPage(
  path: string[],
  parentPath: string[],
  items: Array<Entry<Contentful.Page | Contentful.Site>>
): Entry<Contentful.Page> | undefined {
  for (const item of items) {
    const type = item.sys.contentType.sys.id;
    const itemPath: string[] = [...parentPath, item.fields.slug].filter((path) => path !== "index");

    if (type === "isaacSite") {
      return findPage(path, itemPath, (item as Entry<Contentful.Site>).fields.items);
    }

    if (type === "isaacPage") {
      if (path.join("/") === itemPath.join("/")) {
        return item as Entry<Contentful.Page>;
      }
    }
  }
}
