import { NextSeo } from "next-seo";
import { ProductPageData } from "@/libs/getProduct";

export const ProductPageSeo = ({
  title,
  description,
  ogpShortTitle,
  ogpImageUrl,
  domain,
  pathname,
}: ProductPageData) => {
  return (
    <NextSeo
      title={title ?? ""}
      description={description ?? ""}
      openGraph={{
        site_name: ogpShortTitle ?? "",
        url: `https://${domain}/${pathname}`,
        type: "article",
        title: title ?? "",
        description: description ?? "",
        locale: "ja_JP",
        images: ogpImageUrl ? [{ url: ogpImageUrl }] : undefined,
      }}
      twitter={{
        cardType: "summary_large_image",
      }}
    />
  );
};
