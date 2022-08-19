import type { NextApiHandler } from "next";
import { DomainMapItem, getDomainMap } from "utils/contentful/domain-map";

const editHandler: NextApiHandler<string> = async (req, res) => {
  const id = req.query.id as string;

  if (!id) {
    res.clearPreviewData();
    res.redirect("/");
    return;
  }

  let path: string[] = [""];
  const map = await getDomainMap();

  const searchForId = (item: DomainMapItem) => {
    if (item.id === id) path = item.path;
    else if (item.items) item.items.forEach((item) => searchForId(item));
  };

  searchForId(map);

  try {
    const url = new URL(`http://localhost:3000/${path.join("/")}`);
    res.redirect(url.pathname);
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
};

export default editHandler;
