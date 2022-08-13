import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Next } from "types/next";
import { PageProps } from "types/page";
import { getDomainStaticPaths } from "utils/contentful/domain-paths";
import { getContentfulPage } from "utils/contentful/domain-page";

const Button = dynamic(() => import("components/Button"));

export default function Page({ path, page }: PageProps) {
  const { isFallback, isPreview } = useRouter();

  return (
    <div>
      page! <Button initialCount={10} />
      <pre>{JSON.stringify({ path, page, isFallback, isPreview }, null, 2)}</pre>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // assumes production paths - do not have access to preview cookie here
    // will render fallback page if not found, which allows for unpublished content
    paths: await getDomainStaticPaths(),
    fallback: true,
  };
};

type StaticProps = GetStaticProps<PageProps, Next.Params, Next.PreviewData>;

export const getStaticProps: StaticProps = async ({ params, previewData }) => {
  const path = params?.path || [];
  const page = await getContentfulPage(path);

  if (!page) return { notFound: true };

  return {
    props: {
      path,
      page,
    },
    // netlify does not support revalidation more than every 60 seconds
    revalidate: 60,
  };
};
