import { DomainMapItem, getDomainMap } from "./domain-map";

export async function getContentfulPage(path: string[]) {
  const map = await getDomainMap();

  const item = mapToPath(path, map);
  return item;
}

function mapToPath(path: string[], item: DomainMapItem): DomainMapItem | undefined {
  if (item.type === "isaacPage") {
    if (path.join("/") === item.path.join("/")) return item;
  }

  if (item.items) {
    for (const child of item.items) {
      const match = mapToPath(path, child);
      if (match) return match;
    }
  }
}
