import { GetServerSideProps } from "next";
import { useState } from "react";
import { CONTENTFUL_SPACE_ID } from "utils/constants/env";
import { DomainMapItem, getDomainMap } from "utils/contentful/domain-map";

interface MapProps {
  items: Array<DomainMapItem>;
}

export default function Map({ items }: MapProps) {
  const [search, setSearch] = useState("");

  let finalItems = items;

  if (search) {
    finalItems = [];

    const filterItem = (item: DomainMapItem) => {
      let valid = false;

      if (item.title.toLowerCase().includes(search)) valid = true;
      if (item.slug && item.slug.toLowerCase().includes(search)) valid = true;

      if (valid) finalItems.push(item);

      if (item.items) item.items.forEach((item) => filterItem(item));
    };

    items.forEach((item) => filterItem(item));
  }

  return (
    <>
      <input
        style={{ margin: "1em 0" }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      {finalItems.map((item, i) => (
        <Details open={search.length <= 0} key={i} item={item} />
      ))}

      <pre>{JSON.stringify(finalItems, null, 2)}</pre>
    </>
  );
}

interface DetailsProps {
  open: boolean;
  item: DomainMapItem;
}

function Details({ open, item }: DetailsProps) {
  const url = new URL(`https://app.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/entries/${item.id}`);
  // if (item.parentId) {
  //   url.searchParams.set("previousEntries", item.parentId);
  // }

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
      {item.type === "isaacPage" && (
        <a href={"/" + item.path.join("/")} rel="noreferrer" target={"_blank"}>
          View
        </a>
      )}
    </summary>
  );

  if (item.items && item.items?.length > 0) {
    return (
      <details style={{}} open={open}>
        {summary}

        <div style={{ margin: "0 0 0 1em" }}>
          {item.items.map((child, i) => (
            <Details open={open} key={i} item={child} />
          ))}
        </div>
      </details>
    );
  }

  return summary;
}

export const getServerSideProps: GetServerSideProps<MapProps> = async () => {
  const domainMap = await getDomainMap();

  return {
    props: { items: [domainMap] },
  };
};
