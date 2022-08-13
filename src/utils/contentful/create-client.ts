import { createClient } from "contentful";
import { CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_PREVIEW_TOKEN, CONTENTFUL_SPACE_ID } from "utils/constants/env";

interface ContentfulClientProps {
  draft?: boolean;
  accessToken?: string;
}

export function createContentfulClient({ draft, accessToken }: ContentfulClientProps = {}) {
  return createClient({
    environment: "master",
    space: CONTENTFUL_SPACE_ID,
    host: `${draft ? "preview" : "cdn"}.contentful.com`,
    accessToken: accessToken || (draft ? CONTENTFUL_PREVIEW_TOKEN : CONTENTFUL_DELIVERY_TOKEN),
  });
}
