import { NextSeo } from "next-seo";
import { Product } from "@/libs/getProduct";

export const ProductPageSeo = ({
  productCode,
  pageData: { title, description, ogpShortTitle, ogpImageUrl, domain },
}: Product) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        site_name: ogpShortTitle,
        url: `https://${domain}/${productCode}`,
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
