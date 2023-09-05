import { CustomAttributes } from "@/libs/makeCustomAttributes";

declare global {
  interface Window {
    ShopifyCustomAttribute?: CustomAttributes;
    ShopifyBuy: {
      buildClient: (arg: {
        domain: string;
        storefrontAccessToken: string;
      }) => unknown;
      UI: {
        init: (arg: unknown) => {
          createComponent: (name: string, options: unknown) => void;
        };
        domains: {
          [key: string]: {
            components: {
              cart: [
                {
                  addVariantToCart: (
                    variant: { id: string },
                    quantity?: number,
                    customAttributes?: CustomAttributes,
                    openCart?: boolean
                  ) => Promise<unknown>;
                }
              ];
            };
          };
        };
      };
    };
  }
}
