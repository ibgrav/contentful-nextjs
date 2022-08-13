import type { Entry } from "contentful";
import type { Contentful } from "types/contentful";

export function resolvePageSlug(slug: Array<string>, page: Entry<Contentful.Page>, isParent?: boolean): void {
  const parts = (page.fields.slug?.split("/") || []).filter((part) => part !== "index");

  if (isParent) {
    slug.unshift(...parts);
  } else {
    slug.push(...parts);
  }

  if (page.fields.parentPage?.fields.slug) {
    resolvePageSlug(slug, page.fields.parentPage, true);
  }
}
