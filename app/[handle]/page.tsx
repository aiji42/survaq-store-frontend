import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProduct } from "@/libs/getProduct";
import Head from "next/head";
import { ProductPageSeo } from "@/components/ProductPageSeo";
import { AddToCart } from "@/components/AddToCart";
import { notFound } from "next/navigation";
import { ReplaceSchedule } from "@/components/ReplaceSchedule";

export const dynamic = "force-dynamic";
export const runtime = "experimental-edge";

type Props = {
  params: { handle: string };
};

export default async function Page({ params: { handle } }: Props) {
  const props = await getProduct(handle);
  if (!props) return notFound();

  return (
    <>
      <Head>
        <head
          dangerouslySetInnerHTML={{
            __html: props.customHead ?? "",
          }}
        />
        {props.favicon && <link rel="shortcut icon" href={props.favicon.url} />}
      </Head>
      <ProductPageSeo {...props} />
      <div
        dangerouslySetInnerHTML={{
          __html: props.customBody ?? "",
        }}
      />
      <Header {...props} />
      <main className="item_main_content">
        <div dangerouslySetInnerHTML={{ __html: props.body ?? "" }} />
        {props.buyButton && <AddToCart {...props} />}
      </main>
      <ReplaceSchedule {...props} />
      <Footer />
    </>
  );
}
