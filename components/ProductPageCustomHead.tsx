import { ProductPageData } from "@/libs/getProduct";
import Script from "next/script";

type ScriptContent = {
  type: "url" | "inline";
  content: string;
};

const simpleHash = (str: string) => {
  return Array.from(str)
    .reduce((acc, char) => {
      acc = (acc << 5) - acc + char.charCodeAt(0);
      return acc & acc; // Convert to a 32bit integer
    }, 0)
    .toString(16);
};

export const ProductPageCustomHead = ({ customHead }: ProductPageData) => {
  const scripts = [
    ...(customHead
      ?.replaceAll("\n", "")
      ?.matchAll(/<script\s*(?:src="([^"]+)")?.*?>(.*?)<\/script>/g) ?? []),
  ].reduce<ScriptContent[]>((acc, [, url, inlineScript]) => {
    if (url) acc.push({ type: "url", content: url });
    if (inlineScript.trim())
      acc.push({ type: "inline", content: inlineScript.trim() });
    return acc;
  }, []);

  return (
    <>
      {scripts.map(({ type, content }, i) =>
        type === "inline" ? (
          <Script
            id={simpleHash(content)}
            key={i}
            dangerouslySetInnerHTML={{ __html: content }}
            strategy="afterInteractive"
          />
        ) : (
          <Script
            id={simpleHash(content)}
            key={i}
            src={content}
            strategy="afterInteractive"
          />
        )
      )}
    </>
  );
};
