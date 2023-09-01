import { useReducer } from "react";
import { times } from "@/libs/times";
import { SKU, Variant } from "@/libs/getProduct";

type Selects = {
  label: string;
  selected: SKU;
}[];

export const useSkuSelectors = () => {
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
          selects: times(variant.skuSelectable).map((index) => ({
            label: variant.skuLabel
              ? variant.skuLabel.replace(/#/g, String(index + 1))
              : "",
            variant,
            selected: variant.selectableSKUs[0],
          })),
          variant,
        };
      }

      const sku = status.variant?.selectableSKUs.find(
        ({ code }) => code === action.value
      );
      if (!sku) throw new Error();
      status.selects[action.index].selected = sku;

      return status;
    },
    { selects: [], variant: undefined }
  );

  return { ...value, handleSku };
};
