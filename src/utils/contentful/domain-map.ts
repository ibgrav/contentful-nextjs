import { Entry } from "contentful";
import { Contentful } from "types/contentful";
import { getContentfulDomain } from "./domain-data";

export interface DomainMapItem {
  id: string;
  type: string;
  title: string;
  path: string[];
  slug?: string;
  page?: Contentful.Page;
  items?: Array<DomainMapItem>;
}

type ItemEntry = Entry<Partial<Contentful.Domain | Contentful.Site | Contentful.Page>>;

export async function getDomainMap() {
  const { domain } = await getContentfulDomain();
  return mapEntryItem({ entry: domain, parentId: "", parentPath: [] });
}

interface MapEntryItemProps {
  entry: ItemEntry;
  parentId: string;
  parentPath: string[];
}

function mapEntryItem({ entry, parentPath }: MapEntryItemProps) {
  const type = entry.sys.contentType?.sys?.id || "unknown";

  const item: DomainMapItem = {
    type,
    path: [...parentPath],
    id: entry.sys.id,
    title: entry.fields?.title || "",
  };

  if (type === "isaacDomain") {
    const fields = entry.fields as Contentful.Domain;
    item.items = [mapEntryItem({ entry: fields.site, parentId: item.id, parentPath: item.path })];
  }

  if (type === "isaacPage") {
    item.page = entry.fields as Contentful.Page;
    item.slug = item.page.slug;
    item.path.push(item.slug);
  }

  if (type === "isaacSite") {
    const fields = entry.fields as Contentful.Site;
    item.slug = fields.slug;
    item.path.push(item.slug);
    item.items = fields.items?.map((entry) => mapEntryItem({ entry, parentId: item.id, parentPath: item.path })) || [];
  }

  item.path = item.path.filter((path) => path !== "index");

  return item;
}
