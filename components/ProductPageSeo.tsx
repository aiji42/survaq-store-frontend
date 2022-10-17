import { NextSeo } from "next-seo";
import { Product } from "@/libs/getProduct";

export const ProductPageSeo = ({
  pageData: {
    title,
    description,
    ogpShortTitle,
    ogpImageUrl,
    domain,
    pathname,
  },
}: Product) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        site_name: ogpShortTitle,
        url: `https://${domain}/${pathname}`,
        type: "article",
        title,
        description,
        locale: "ja_JP",
        images: ogpImageUrl ? [{ url: ogpImageUrl }] : undefined,
      }}
      twitter={{
        cardType: "summary_large_image",
      }}
    />
  );
};
