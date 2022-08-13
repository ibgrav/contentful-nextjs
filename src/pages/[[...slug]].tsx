import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Next } from "types/next";
import { PageProps } from "types/page";
// import { createContentfulClient } from "utils/contentful/client";
import { getDomainPaths } from "utils/contentful/domain-paths";

const Button = dynamic(() => import("components/Button"));

export default function Page({ slug, title }: PageProps) {
  const { isFallback, isPreview } = useRouter();

  return (
    <div>
      <pre>{JSON.stringify({ slug, title, isFallback, isPreview }, null, 2)}</pre>
      page! <Button initialCount={10} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // assumes production paths - do not have access to preview cookie here
    // will render fallback page if not found, which allows for unpublished content
    paths: await getDomainPaths(),
    fallback: true,
  };
};

type StaticProps = GetStaticProps<PageProps, Next.Params, Next.PreviewData>;

export const getStaticProps: StaticProps = async ({ params, previewData }) => {
  const props = { slug: params?.slug || [], title: "" };

  // const client = createContentfulClient({ draft: true });

  return {
    props,
    revalidate: 10,
  };
};
