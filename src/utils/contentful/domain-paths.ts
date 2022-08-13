import { Entry } from "contentful";
import type { Contentful } from "types/contentful";
import { Next } from "types/next";
import { DOMAIN } from "utils/constants/env";
import { createContentfulClient } from "./client";

export async function getDomainPaths(): Promise<Next.Paths> {
  const paths: Set<string> = new Set();

  const sitePaths = (site: Entry<Contentful.Site>, parentSlug: Next.Slug) => {
    const siteSlug: Next.Slug = [...parentSlug, site.fields.slug];

    if (Array.isArray(site.fields.items)) {
      for (const item of site.fields.items) {
        if (item.sys.contentType.sys.id === "isaacSite") {
          sitePaths(item as Entry<Contentful.Site>, siteSlug);
        }

        if (item.sys.contentType.sys.id === "isaacPage") {
          const pageSlug: Next.Slug = [...siteSlug, item.fields.slug].filter((path) => path !== "index");
          paths.add(pageSlug.join("/"));
        }
      }
    }
  };

  const client = createContentfulClient({ draft: true });

  const domainEntries = await client.getEntries<Contentful.Domain>({
    limit: 1,
    include: 10,
    content_type: "isaacDomain",
    "fields.title": DOMAIN,
  });

  const domain = domainEntries.items[0];
  if (domain) sitePaths(domain.fields.site, []);

  return Array.from(paths).map((path) => ({ params: { slug: path.split("/") } }));
}
