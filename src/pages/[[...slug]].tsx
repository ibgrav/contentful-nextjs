import type { GetStaticPaths, GetStaticProps } from "next";
import { lazy } from "react";
import { getSitePaths } from "utils/contentful/site-paths";

const Button = lazy(() => import("components/Button"));

interface PageProps {
  path: string;
}

export default function Page({ path }: PageProps) {
  return (
    <div>
      <pre>{JSON.stringify({ path }, null, 2)}</pre>
      page! <Button initialCount={10} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: await getSitePaths(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async (ctx) => {
  let path: string = "";
  const slug = ctx.params?.slug;
  if (Array.isArray(slug)) path = slug.join("/");

  return {
    props: {
      path,
    },
  };
};
