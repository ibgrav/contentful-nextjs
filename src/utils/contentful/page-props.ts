import { Entry } from "contentful";
import { Contentful } from "types/contentful";
import type { Next } from "types/next";
import { PageProps } from "types/page";
import { SITE_ID } from "utils/constants/env";
import { createContentfulClient } from "./client";
import { resolvePageSlug } from "./resolve-page-slug";

export async function getPageProps(slug: Array<string>, previewData?: Next.PreviewData): Promise<PageProps> {
  const props: PageProps = {
    title: "",
    slug,
  };

  const client = createContentfulClient();

  let entry: undefined | Entry<Contentful.Page> = undefined;

  if (previewData?.contentfulEntryId) {
    entry = await client.getEntry<Contentful.Page>(previewData.contentfulEntryId, { include: 10 });
  } else {
    const pages = await client.getEntries<Contentful.Page>({
      limit: 100,
      include: 10,
      content_type: "page",
      "fields.slug": slug[slug.length - 1],
      "fields.site.fields.siteId": SITE_ID,
      "fields.site.sys.contentType.sys.id": "site",
    });

    for (const page of pages.items) {
      const pageSlug: string[] = [];
      resolvePageSlug(pageSlug, page);

      if (pageSlug.join("/") === slug.join("/")) {
        entry = page;
      }
    }
  }

  if (entry) {
    props.title = entry.fields.title;
  }

  return props;
}
