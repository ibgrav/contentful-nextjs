import type { Next } from "types/next";
import { DomainMapItem, getDomainMap } from "./domain-map";

export async function getDomainStaticPaths(): Promise<Next.Paths> {
  // using a set to make sure there are no duplicate paths
  const paths: Set<string> = new Set();

  const map = await getDomainMap();

  const addPath = (item: DomainMapItem) => {
    if (item.type === "isaacPage") paths.add(item.path.join("/"));
    if (item.items) item.items.forEach((item) => addPath(item));
  };

  addPath(map);

  return Array.from(paths).map((path) => ({ params: { path: path.split("/") } }));
}
