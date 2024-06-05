import { Variant } from "@/libs/getProduct";
import { Selects } from "@/libs/hooks/useSkuSelectors";
import { getGAClientId } from "@/libs/getGAClientId";

export type CustomAttributes = { key: string; value: string }[];

export const makeCustomAttributes = async (
  variant?: Variant,
  selects: Selects = []
) => {
  const ga = await getGAClientId();

  return [
    {
      key: "_skus",
      value: JSON.stringify([
        ...(variant?.skus ?? []),
        ...selects.map(({ selected }) => selected.code),
      ]),
    },
    ...selects?.map(({ label, selected }, index) => ({
      key: label,
      value: selected.name,
    })),
    ...selects.map(({ selected }, index) => ({
      key: `_sku${index + 1}`,
      value: selected.code,
    })),
    ...Array.from(new URL(location.href).searchParams).reduce<CustomAttributes>(
      (res, [key, value]) => {
        return key.startsWith("utm_")
          ? [...res, { key: `_${key}`, value }]
          : res;
      },
      []
    ),
    {
      key: "_source",
      value: `${location.origin}${location.pathname}`,
    },
    {
      key: "_ga",
      value: ga ?? "",
    },
  ];
};
