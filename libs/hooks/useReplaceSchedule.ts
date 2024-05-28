import { Product, ProductPageData, Schedule } from "@/libs/getProduct";
import { useEffect } from "react";

const replaceSchedule = (
  schedule: Schedule,
  target: HTMLDivElement | HTMLParagraphElement | HTMLSpanElement
) => {
  const short = !!target.dataset.short;
  target.innerText = schedule.text.slice(short ? 5 : NaN) ?? "";
};

export const useReplaceSchedule = (product: Product) => {
  useEffect(() => {
    document
      .querySelectorAll<HTMLSpanElement>(".delivery-schedule")
      .forEach((t) => {
        replaceSchedule(product.schedule, t);
      });
  }, [product.schedule]);
};
