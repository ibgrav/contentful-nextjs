import type { Contentful } from "types/contentful";
import { SITE_ID } from "utils/constants/env";
import { createContentfulClient } from "./client";
import { resolvePageSlug } from "./resolve-page-slug";

interface SitePath {
  params: { slug: Array<string> };
}

export async function getSitePaths() {
  const paths: Array<SitePath> = [];

  const client = createContentfulClient();

  const pages = await client.getEntries<Contentful.Page>({
    skip: 0,
    limit: 1000,
    include: 10,
    content_type: "page",
    "fields.site.fields.siteId": SITE_ID,
    "fields.site.sys.contentType.sys.id": "site",
  });

  pages.items.map((page) => {
    const slug: string[] = [];
    resolvePageSlug(slug, page);
    paths.push({ params: { slug } });
  });

  return paths;
}
