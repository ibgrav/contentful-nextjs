export namespace Next {
  export type Slug = Array<string>;
  export type Params = { slug: Slug };

  export type Paths = Array<{
    params: Params;
  }>;

  export interface PreviewData {
    contentfulEntryId?: string;
  }
}
