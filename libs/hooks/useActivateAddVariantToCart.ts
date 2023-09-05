import { useEffect } from "react";
import { getProductDataById } from "@/libs/getProduct";
import { latest } from "@/libs/schedule";
import { makeCustomAttributes } from "@/libs/makeCustomAttributes";

const domain = `${process.env.NEXT_PUBLIC_STORE_DOMAIN}.${process.env.NEXT_PUBLIC_STORE_FRONT_ACCESS_TOKEN}`;

export const useActivateAddVariantToCart = () => {
  useEffect(() => {
    const handlers: Array<[HTMLElement, (e: MouseEvent) => void]> = [];
    document
      .querySelectorAll<HTMLElement>(".add-variant-to-cart")
      .forEach((t) => {
        const productId = t.dataset.productId;
        if (!productId) {
          console.error("`data-product-id` is not set");
          return;
        }
        const variantId = t.dataset.variantId;
        if (!variantId) {
          console.error("`data-variant-id` is not set");
          return;
        }
        const quantity = Number(t.dataset.quantity ?? "1");

        const handler = async (e: MouseEvent) => {
          e.preventDefault();

          const product = await getProductDataById(productId);
          const variant = product.variants.find(
            (variant) => variant.variantId === variantId
          );

          if (!variant) {
            console.error(
              `Not found variant for productId: ${productId} variantId: ${variantId}`
            );
            return;
          }

          const schedule = latest([
            product.schedule,
            variant?.defaultSchedule ?? null,
          ]);

          await window.ShopifyBuy.UI.domains[
            domain
          ].components.cart[0].addVariantToCart(
            { id: `gid://shopify/ProductVariant/${variantId}` },
            quantity,
            makeCustomAttributes(variant, schedule),
            true
          );
        };
        handlers.push([t, handler]);
      });
    handlers.forEach(([t, handler]) => {
      t.addEventListener("click", handler);
    });
    return () => {
      handlers.forEach(([t, handler]) => {
        t.removeEventListener("click", handler);
      });
    };
  }, []);
};
