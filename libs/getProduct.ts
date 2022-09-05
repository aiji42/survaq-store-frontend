import Shopify from "@shopify/shopify-api";

type ProductOnShopify = {
  id: string;
  handle: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  featuredImage: {
    id: string;
    width: number;
    height: number;
    url: string;
    altText: string | null;
  } | null;
  images: { edges: { node: { url: string } }[] };
  seo: {
    title: string | null;
    description: string | null;
  };
  description: string;
  descriptionHtml: string;
};

const query = (handle: string) => `
{
  productByHandle(handle: "${handle}") {
    id
    handle
    title
    createdAt
    updatedAt
    featuredImage {
      id
      width
      height
      url
      altText
    }
    images(first: 5) {
      edges {
        node {
          url
        }
      }
    }
    seo {
      title
      description
    }
    description
    descriptionHtml
  }
}
`;

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
    data: query(handle),
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

type ProductOnApi = {
  id: string;
  productCode: string;
  productName: string;
  variants?: Array<Variant>;
  skuLabel?: string;
  foundation: Foundation;
  rule: Rule;
};

const getProductOnApi = async (
  productId: string | number
): Promise<ProductOnApi> => {
  return fetch(
    `https://survaq-api-production.aiji422990.workers.dev/products/${productId}`
  ).then((res) => res.json());
};

export type Product = ProductOnShopify &
  Omit<
    ProductOnApi,
    "id" | "productCode" | "productName" | "variants" | "skuLabel"
  > & {
    variants: Array<Variant>;
    skuLabel: string | null;
  };

export const getProduct = async (
  handle: string,
  id: string | number
): Promise<Product> => {
  const [shopify, { variants = [], skuLabel = null, foundation, rule }] =
    await Promise.all([getProductOnShopify(handle), getProductOnApi(id)]);

  return { ...shopify, variants, skuLabel, foundation, rule };
};
