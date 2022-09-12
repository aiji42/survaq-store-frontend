import Shopify from "@shopify/shopify-api";

type ProductOnShopify = {
  descriptionHtml: string;
};

const getProductOnShopify = async (
  handle: string
): Promise<ProductOnShopify> => {
  const client = new Shopify.Clients.Graphql(
    `${process.env.SHOPIFY_SHOP_NAME}.myshopify.com`,
    process.env.SHOPIFY_API_SECRET_KEY
  );
  const {
    body: {
      // @ts-ignore
      data: { productByHandle },
    },
  } = await client.query({
    data: `{
              productByHandle(handle: "${handle}") {
                descriptionHtml
              }
           }`,
  });

  return productByHandle;
};

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
  productHandle?: string;
  customBody?: string;
  productId?: string;
  domain?: string;
  ogpImageUrl?: string;
  ogpShortTitle?: string;
  buyButton?: boolean;
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
  descriptionHtml: string;
};

export const getProduct = async (handle: string): Promise<Product> => {
  const { pageData } = await getProductPageData(handle);
  if (!pageData.productId || !pageData.productHandle) throw new Error();

  const [
    { variants = [], skuLabel = null, foundation, rule, productCode },
    { descriptionHtml },
  ] = await Promise.all([
    getProductData(pageData.productId),
    getProductOnShopify(pageData.productHandle),
  ]);

  return {
    variants,
    skuLabel,
    foundation,
    rule,
    productCode,
    pageData,
    descriptionHtml,
  };
};
