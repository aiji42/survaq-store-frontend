import { Variant } from "@/libs/getProduct";
import { getGAClientId } from "@/libs/getGAClientId";

export type CustomAttributes = { key: string; value: string }[];

export const makeCustomAttributes = async (
  variant?: Variant,
  additionalSKUCodes: string[] = []
) => {
  const ga = await getGAClientId()
  return [
    {
      key: "_skus",
      value: JSON.stringify([
        ...(variant?.baseSKUs.map(({ code }) => code) ?? []),
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
    ...(ga ? [{
      key: '_ga',
      value: ga
    }] : [])
  ];
};
