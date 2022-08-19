import { Entry } from "contentful";
import { Contentful } from "types/contentful";

export function resolveEntry<F>(link: Contentful.EntryLink, refs: Contentful.Includes) {
  return refs.Entry.find((item) => item.sys.id === link.sys.id) as Entry<F> | undefined;
}
