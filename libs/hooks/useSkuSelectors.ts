import { useReducer } from "react";
import { times } from "@/libs/times";
import { Product } from "@/libs/getProduct";

type Variant = Product["variants"][number];

export const useSkuSelectors = ({ skuLabel }: Pick<Product, "skuLabel">) => {
  const [selects, handleSku] = useReducer(
    (
      status: {
        label: string;
        variant: Variant;
        selected: Variant["skus"][number];
      }[],
      action:
        | { type: "reset"; variant: Variant | undefined }
        | { type: "select"; index: number; value: string }
    ) => {
      if (action.type === "reset") {
        const { variant } = action;
        if (!variant) return [];
        if (variant.variantId === status[0]?.variant.variantId)
          return [...status];
        return times(variant.skuSelectable).map((index) => ({
          label: skuLabel ? skuLabel.replace(/#/g, String(index + 1)) : "",
          variant,
          selected: variant.skus[0],
        }));
      }

      const sku = status[action.index].variant.skus.find(
        ({ code }) => code === action.value
      );
      if (!sku) throw new Error();
      status[action.index].selected = sku;

      return status;
    },
    []
  );

  return { selects, handleSku };
};
