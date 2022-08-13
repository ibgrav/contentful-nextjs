export namespace Next {
  export type Params = { path: Array<string> };

  export type Paths = Array<{
    params: Params;
  }>;

  export interface PreviewData {
    contentfulEntryId?: string;
  }
}
