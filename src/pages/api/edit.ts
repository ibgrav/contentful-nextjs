import type { NextApiHandler } from "next";
import { getContentfulMapItem } from "utils/contentful/get-map-item";

const editHandler: NextApiHandler<string> = async (req, res) => {
  const id = req.query.id as string;

  if (!id) {
    res.clearPreviewData();
    res.redirect("/");
    return;
  }

  let path: string[] = [""];

  const item = await getContentfulMapItem({ id });
  if (item) path = item.path;

  try {
    const url = new URL(`http://localhost:3000/${path.join("/")}`);
    res.redirect(url.pathname);
  } catch (e) {
    console.error(e);
    res.redirect("/");
  }
};

export default editHandler;
