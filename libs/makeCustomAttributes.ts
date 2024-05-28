import { Variant } from "@/libs/getProduct";

export type CustomAttributes = { key: string; value: string }[];

export const makeCustomAttributes = (
  variant?: Variant,
  additionalSKUCodes: string[] = []
) => {
  return [
    {
      key: "_skus",
      value: JSON.stringify([
        ...(variant?.skus ?? []),
        ...additionalSKUCodes,
      ]),
    },
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
  ];
};
