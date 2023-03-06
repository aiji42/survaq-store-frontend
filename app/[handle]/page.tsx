import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProduct } from "@/libs/getProduct";
import { AddToCart } from "@/components/AddToCart";
import { notFound } from "next/navigation";
import { ReplaceSchedule } from "@/components/ReplaceSchedule";
import { Metadata } from "next";
import { ProductPageCustomHead } from "@/components/ProductPageCustomHead";

export const dynamic = "force-dynamic";
// MEMO: generateMetadataが使えない
// export const runtime = "experimental-edge";

type Props = {
  params: { handle: string };
};

export async function generateMetadata({
  params: { handle },
}: Props): Promise<Metadata> {
  const props = await getProduct(handle);

  if (!props) return {};

  return {
    title: props.title ?? "",
    description: props.description ?? "",
    openGraph: {
      siteName: props.ogpShortTitle ?? "",
      url: `https://${props.domain}/${props.pathname}`,
      type: "article",
      title: props.title ?? "",
      description: props.description ?? "",
      locale: "ja_JP",
      images: props.ogpImageUrl ? [{ url: props.ogpImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function Page({ params: { handle } }: Props) {
  const props = await getProduct(handle);
  if (!props) return notFound();

  return (
    <>
      <ProductPageCustomHead {...props} />
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
