import { ProductPageData } from "@/libs/getProduct";
import Script from "next/script";

export const ProductPageCustomHead = ({ customHead }: ProductPageData) => {
  const scripts = Array.from(
    customHead?.replaceAll("\n", "")?.matchAll(/<script.?>(.+?)<\/script>/g) ??
      []
  ).flatMap(([, s]) => (s ? s : []));

  return (
    <>
      {scripts.map((script, i) => (
        <Script
          id={script}
          key={i}
          dangerouslySetInnerHTML={{ __html: script }}
          strategy="beforeInteractive"
        />
      ))}
    </>
  );
};
