import { ProductPageData } from "@/libs/getProduct";
import { useEffect } from "react";

const replaceSchedule = (
  schedule: ProductPageData['schedule'],
  target: HTMLDivElement | HTMLParagraphElement | HTMLSpanElement
) => {
  const index = Number(target.dataset.index ?? 0);
  const short = !!target.dataset.short;
  target.innerText = schedule.texts[index]?.slice(short ? 5 : NaN) ?? "";
};

export const useReplaceSchedule = (product: ProductPageData) => {
  useEffect(() => {
    document
      .querySelectorAll<HTMLSpanElement>(".delivery-schedule")
      .forEach((t) => {
        replaceSchedule(product.schedule, t);
      });
  }, [product.schedule]);
};
