import { useReducer } from "react";
import { Product, SKU, Variant } from "@/libs/getProduct";

export type Selects = {
  label: string;
  skus: SKU[];
  selected: SKU;
}[];

const getSelectableSKUs = (product: Product, code: string) => {
  const skuCodes = product.skuGroups[code];
  return skuCodes.map((skuCode) => product.skus[skuCode]);
};

export const useSkuSelectors = (product: Product) => {
  const [value, handleSku] = useReducer(
    (
      status: { selects: Selects; variant: Variant | undefined },
      action:
        | { type: "reset"; variant: Variant | undefined }
        | { type: "select"; index: number; value: string }
    ) => {
      if (action.type === "reset") {
        const { variant } = action;
        if (!variant) return { selects: [], variant };
        if (variant.variantId === status.variant?.variantId)
          return { selects: [...status.selects], variant };
        return {
          selects: variant.skuGroups.map(({ label, skuGroupCode }) => {
            const skus = getSelectableSKUs(product, skuGroupCode);
            return {
              label,
              skus,
              selected: skus[0],
            };
          }),
          variant,
        };
      }

      const sku = product.skus[action.value];
      if (!sku) throw new Error();
      status.selects[action.index].selected = sku;

      return status;
    },
    { selects: [], variant: undefined }
  );

  return { ...value, handleSku };
};
