import type { Asset, Entry, Link } from "contentful";

export namespace Contentful {
  export interface EntryLink {
    sys: Link<"Entry">;
  }

  export interface Includes {
    Entry: Array<Entry<unknown>>;
    Asset: Array<Asset>;
  }

  export interface Domain {
    title: string;
    site: Entry<Site>;
  }

  export interface Site {
    title: string;
    slug: string;
    items: Array<Entry<Page | Site>>;
  }

  export interface Page {
    title: string;
    slug: string;
    content: Record<string, unknown>;
  }
}
