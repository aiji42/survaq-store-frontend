import { GetStaticPaths, GetStaticProps } from "next";
import { getProduct, Product } from "@/libs/getProduct";
import { AddToCart } from "@/components/AddToCart";
import { ProductPageSeo } from "@/components/ProductPageSeo";
import { useReplaceSchedule } from "@/libs/hooks/useReplaceSchedule";
import Head from "next/head";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  { product: Product; handle: string },
  { handle: string }
> = async ({ params }) => {
  const handle = params?.handle;
  if (!handle) throw new Error();
  try {
    const product = await getProduct(handle);
    return {
      props: {
        product,
        handle,
      },
      revalidate: 3600,
    };
  } catch (_) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};

export const Page = (props: { product: Product; handle: string }) => {
  useReplaceSchedule(props.product);

  return (
    <>
      <Head>
        <head
          dangerouslySetInnerHTML={{
            __html: props.product.pageData.customHead ?? "",
          }}
        />
        {props.product.pageData.favicon && (
          <link rel="shortcut icon" href={props.product.pageData.favicon.url} />
        )}
      </Head>
      <ProductPageSeo {...props.product} />
      <div
        dangerouslySetInnerHTML={{
          __html: props.product.pageData.customBody ?? "",
        }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: props.product.descriptionHtml }}
      />
      {props.product.pageData.productId && props.product.pageData.buyButton && (
        <AddToCart {...props} productId={props.product.pageData.productId} />
      )}
    </>
  );
};

export default Page;
