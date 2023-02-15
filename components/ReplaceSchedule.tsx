"use client";
import { ProductPageData } from "@/libs/getProduct";
import { useReplaceSchedule } from "@/libs/hooks/useReplaceSchedule";

export const ReplaceSchedule = (product: ProductPageData) => {
  useReplaceSchedule(product);

  return null;
};
