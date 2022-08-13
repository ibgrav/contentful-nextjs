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

  const posts = await client.getEntries<Contentful.Post>({
    include: 1,
    content_type: "post",
    "fields.site.fields.siteId": SITE_ID,
    "fields.site.sys.contentType.sys.id": "site",
  });

  posts.items.map((post) => {
    const slug = post.fields.slug.split("/");
    slug.unshift("item");
    paths.push({ params: { slug } });
  });

  return paths;
}
