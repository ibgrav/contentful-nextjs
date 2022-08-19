import { DomainMapItem, getDomainMap } from "./domain-map";

interface GetContentfulPageProps {
  id?: string;
  path?: string[];
}

export async function getContentfulMapItem({ id, path }: GetContentfulPageProps) {
  const map = await getDomainMap();

  if (id) return getMapItemById(id, map);
  if (path) return getMapItemByPath(path, map);
}

export function getMapItemById(id: string, item: DomainMapItem) {
  if (item.id === id) return item;
  if (item.items) item.items.forEach((item) => getMapItemById(id, item));
}

export function getMapItemByPath(path: string[], item: DomainMapItem): DomainMapItem | undefined {
  if (item.type === "isaacPage") {
    if (path.join("/") === item.path.join("/")) return item;
  }

  if (item.items) {
    for (const child of item.items) {
      const match = getMapItemByPath(path, child);
      if (match) return match;
    }
  }
}
