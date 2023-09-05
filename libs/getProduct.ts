export type Schedule = {
  year: number;
  month: number;
  term: "early" | "middle" | "late";
  termIndex: number;
  text: string;
  texts: string[];
  subText: string;
};

export type SKU = {
  code: string;
  name: string;
  subName: string;
  schedule: Omit<Schedule, "texts"> | null;
};

export type Variant = {
  variantId: string;
  variantName: string;
  skuLabel: string | null;
  skuSelectable: number;
  baseSKUs: SKU[];
  selectableSKUs: SKU[];
  defaultSchedule: Omit<Schedule, "texts"> | null;
};

type PageDataOriginal = {
  title: string | null;
  description: string | null;
  customHead: string | null;
  logo: { filename_disk: string; height: number; width: number } | null;
  favicon: { filename_disk: string } | null;
  productHandle: string;
  customBody: string | null;
  body: string | null;
  domain: string;
  pathname: string;
  ogpImageUrl: string | null;
  ogpShortTitle: string | null;
  buyButton: boolean;
};

type ProductData = {
  variants: Array<Variant>;
  schedule: Schedule;
  productId: string;
};

export type ProductPageData = ProductData &
  Omit<PageDataOriginal, "logo" | "favicon"> & {
    logo: { url: string; height: number; width: number } | null;
    favicon: { url: string } | null;
  };

export const getProduct = async (
  code: string
): Promise<ProductPageData | null> => {
  const res = await fetch(
    `${process.env.SURVAQ_API_ORIGIN}/products/page-data/${code}/supabase`,
    { cache: "no-store" }
  );
  if (res.status === 404) {
    return null;
  }
  if (res.status !== 200) {
    throw new Error(await res.text());
  }

  const json = (await res.json()) as PageDataOriginal & ProductData;

  return {
    ...json,
    logo: json.logo
      ? {
          ...json.logo,
          url: `${process.env.SURVAQ_STATIC_ORIGIN}/${json.logo.filename_disk}`,
        }
      : null,
    favicon: json.favicon
      ? {
          ...json.favicon,
          url: `${process.env.SURVAQ_STATIC_ORIGIN}/${json.favicon.filename_disk}`,
        }
      : null,
  };
};

export const getProductDataById = async (id: string): Promise<ProductData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SURVAQ_API_ORIGIN}/products/${id}/supabase`,
    { cache: "no-store" }
  );
  if (res.status !== 200) {
    throw new Error(await res.text());
  }

  return (await res.json()) as ProductData;
};
