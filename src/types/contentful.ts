import type { Entry } from "contentful";

export namespace Contentful {
  export interface Domain {
    title: string;
    site: Entry<Site>;
  }

  export interface Site {
    title: string;
    slug: string;
    items: Array<Entry<Site> | Entry<Page>>;
  }

  export interface Page {
    title: string;
    slug: string;
    content: Record<string, unknown>;
  }
}
