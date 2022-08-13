import type { Entry } from "contentful";

export namespace Contentful {
  export interface Page {
    title: string;
    slug: string;
    parentPage?: Entry<Page>;
  }

  export interface Post {
    title: string;
    slug: string;
  }
}
