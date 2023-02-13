import { ProductPageData } from "@/libs/getProduct";

type DeliverySchedule = Exclude<
  ProductPageData["variants"][number]["skus"][number]["schedule"],
  null
>;

export const latest = (
  schedules: Array<ProductPageData["schedule"] | DeliverySchedule | null>
): DeliverySchedule => {
  return schedules
    .filter((schedule): schedule is DeliverySchedule => !!schedule)
    .sort((a, b) => {
      const l = Number(
        `${a.year}${String(a.month).padStart(2, "0")}${a.termIndex}`
      );
      const r = Number(
        `${b.year}${String(b.month).padStart(2, "0")}${b.termIndex}`
      );
      return l > r ? -1 : l < r ? 1 : 0;
    })[0];
};
