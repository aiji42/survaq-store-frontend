type Foundation = {
  fieldId: string;
  totalPrice: number;
  closeOn: string;
  supporter?: number;
};

type Schedule = {
  year: number;
  month: number;
  term: "early" | "middle" | "late";
  text: string;
  texts: string[];
  subText: string;
};

type Rule = {
  fieldId: string;
  schedule: Schedule;
};

type Variant = {
  fieldId: string;
  variantId: string;
  variantName: string;
  skus: { code: string; name: string; subName: string }[];
  skuSelectable: number;
};

type PageData = {
  title?: string;
  description?: string;
  customHead?: string;
  logo?: Image;
  favicon?: Image;
  body?: string;
  customBody?: string;
  productId?: string;
  domain?: string;
  ogpImageUrl?: string;
  ogpShortTitle?: string;
};

type Image = {
  url: string;
  height: number;
  width: number;
};

type ProductData = {
  id: string;
  productCode: string;
  productName: string;
  variants?: Array<Variant>;
  skuLabel?: string;
  foundation: Foundation;
  rule: Rule;
};

type ProductPageData = {
  pageData: PageData;
};

const getProductPageData = async (code: string): Promise<ProductPageData> => {
  return fetch(
    `https://survaq-api-production.aiji422990.workers.dev/products/page-data/${code}`
  ).then((res) => res.json());
};

const getProductData = async (id: string): Promise<ProductData> => {
  return fetch(
    `https://survaq-api-production.aiji422990.workers.dev/products/${id}`
  ).then((res) => res.json());
};

export type Product = {
  variants: Array<Variant>;
  skuLabel: string | null;
  foundation: Foundation;
  rule: Rule;
  pageData: PageData;
  productCode: string;
};

export const getProduct = async (handle: string): Promise<Product> => {
  const { pageData } = await getProductPageData(handle);
  if (!pageData.productId) throw new Error();

  const {
    variants = [],
    skuLabel = null,
    foundation,
    rule,
    productCode,
  } = await getProductData(pageData.productId);

  return { variants, skuLabel, foundation, rule, productCode, pageData };
};
