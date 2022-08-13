import { Entry } from "contentful";
import { Contentful } from "./contentful";

export interface PageProps {
  path: Array<string>;
  page: Entry<Contentful.Page>;
}
