import { Entry } from "contentful";
import { GetServerSideProps } from "next";
import { Contentful } from "types/contentful";
import { CONTENTFUL_SPACE_ID } from "utils/constants/env";
import { createContentfulClient } from "utils/contentful/client";

interface MapItem {
  id: string;
  type: string;
  title: string;
  slug?: string;
  items?: Array<MapItem>;
}

interface MapProps {
  items: Array<MapItem>;
}

export default function Map({ items }: MapProps) {
  return (
    <>
      {items.map((item, i) => (
        <Details key={i} item={item} parentSlug={[]} previousEntries={[]} />
      ))}

      <pre>{JSON.stringify(items, null, 2)}</pre>
    </>
  );
}

interface DetailsProps {
  item: MapItem;
  parentSlug: string[];
  previousEntries: string[];
}

function Details({ item, parentSlug, previousEntries }: DetailsProps) {
  const slug = Array.from([...parentSlug]);
  if (item.slug) slug.push(...item.slug.split("/").filter((path) => path !== "index"));

  const entries = Array.from(previousEntries);

  const url = new URL(`https://app.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries/${item.id}`);
  if (entries.length > 0) {
    url.searchParams.set("previousEntries", entries.join(","));
  }

  const summary = (
    <summary style={{ borderBottom: "1px solid black", paddingBottom: "0.25rem", marginBottom: "0.5rem" }}>
      <span>
        {"[ "}
        {item.type.replace("isaac", "")}
        {" ] "}
      </span>
      {item.title}{" "}
      <a style={{ margin: "0 0.5rem" }} rel="noreferrer" target={"_blank"} href={url.href}>
        Edit
      </a>
      <a href={"/" + slug.join("/")} rel="noreferrer" target={"_blank"}>
        View
      </a>
    </summary>
  );

  if (item.items && item.items?.length > 0) {
    if (item.type !== "domain") entries.push(item.id);

    return (
      <details style={{}} open={true}>
        {summary}

        <div style={{ margin: "0 0 0 1em" }}>
          {item.items.map((child, i) => (
            <Details key={i} item={child} parentSlug={slug} previousEntries={entries} />
          ))}
        </div>
      </details>
    );
  }

  return summary;
}

export const getServerSideProps: GetServerSideProps<MapProps> = async () => {
  const entryItem = (entry: Entry<Contentful.Domain | Contentful.Site | Contentful.Page>) => {
    const type = entry.sys.contentType.sys.id;

    const item: MapItem = {
      type,
      id: entry.sys.id,
      title: entry.fields.title,
    };

    if (type === "isaacDomain") {
      const fields = entry.fields as Contentful.Domain;
      item.items = [entryItem(fields.site)];
    }

    if (type === "isaacPage") {
      const fields = entry.fields as Contentful.Page;
      item.slug = fields.slug;
    }

    if (type === "isaacSite") {
      const fields = entry.fields as Contentful.Site;
      item.slug = fields.slug;
      item.items = fields.items.map((entry) => entryItem(entry));
    }

    return item;
  };

  const client = createContentfulClient({ draft: true });

  const entries = await client.getEntries<Contentful.Domain>({
    limit: 100,
    include: 10,
    content_type: "isaacDomain",
  });

  return {
    props: { items: entries.items.map((entry) => entryItem(entry)) },
  };
};
