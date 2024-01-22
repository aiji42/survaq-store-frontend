"use client";

import { ProductPageData } from "@/libs/getProduct";
import Script from "next/script";
import { MutableRefObject, useRef } from "react";
import { useSkuSelectors } from "@/libs/hooks/useSkuSelectors";
import { MountOnOuterRoot } from "@/components/MountOnOuterRoot";
import { latest } from "@/libs/schedule";
import {
  CustomAttributes,
  makeCustomAttributes,
} from "@/libs/makeCustomAttributes";

type ProductObject = {
  selectedVariantTrackingInfo: { id: string };
  setCustomAttributes: (arg: CustomAttributes) => void;
};

type CartObject = {
  onCheckout: () => void;
  checkout: {
    open: (s: string) => void;
  };
  model: { webUrl: string };
};

export const AddToCart = (product: ProductPageData) => {
  const target = useRef<HTMLDivElement>();
  const { selects, variant, handleSku } = useSkuSelectors();
  const schedule = latest([
    product.schedule,
    variant?.defaultSchedule ?? null,
    ...selects.map(({ selected: { schedule } }) => schedule),
  ]);

  if (typeof window !== "undefined")
    window.ShopifyCustomAttribute = [
      ...makeCustomAttributes(
        variant,
        selects.map(({ selected }) => selected.code)
      ),
      ...selects.map(({ label, selected }) => ({
        key: label,
        value: selected.name,
      })),
    ];

  return (
    <>
      <MountOnOuterRoot target={target.current}>
        {selects.map(({ label, selected }, index) => (
          <div key={index} className="shopify-buy__option-select">
            <label className="shopify-buy__option-select__label">{label}</label>
            <div className="shopify-buy__option-select-wrapper">
              <select
                className="shopify-buy__option-select__select"
                onChange={(e) =>
                  handleSku({ type: "select", value: e.target.value, index })
                }
                defaultValue={selected.code}
              >
                {variant?.selectableSKUs.map(({ name, code }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <svg className="shopify-buy__select-icon" viewBox="0 0 24 24">
                <path d="M21 5.176l-9.086 9.353L3 5.176.686 7.647 12 19.382 23.314 7.647 21 5.176z" />
              </svg>
            </div>
          </div>
        ))}
        {schedule.text !== product.schedule.text && (
          <p className="shopify-buy__message">
            &quot;配送予定：{schedule.text.replace(/(\d{4}|年)/g, "")}&quot;
            の商品が含まれております。
            <br />
            ※2点以上ご注文の場合、全て揃った時点でまとめて発送
          </p>
        )}
      </MountOnOuterRoot>
      <Script
        src="/buybutton.js"
        strategy="afterInteractive"
        onLoad={makeOnLoad({
          productId: product.productId,
          variants: product.variants,
          target,
          handleSku,
        })}
      />
    </>
  );
};

const makeOnLoad =
  ({
    productId,
    variants,
    target,
    handleSku,
  }: {
    productId: number | string;
    variants: ProductPageData["variants"];
    target: MutableRefObject<HTMLDivElement | undefined>;
    handleSku: ReturnType<typeof useSkuSelectors>["handleSku"];
  }) =>
  () => {
    const client = window.ShopifyBuy.buildClient({
      domain: process.env.NEXT_PUBLIC_STORE_DOMAIN ?? "",
      storefrontAccessToken:
        process.env.NEXT_PUBLIC_STORE_FRONT_ACCESS_TOKEN ?? "",
    });
    window.ShopifyBuy.UI.init(client).createComponent("product", {
      id: productId,
      node: document.getElementById("buy-button"),
      moneyFormat: "%C2%A5%7B%7Bamount_no_decimals%7D%7D",
      options: {
        product: {
          iframe: false,
          contents: {
            img: false,
            title: false,
            price: false,
          },
          text: {
            button: "カートに追加",
            unavailable: "お取り扱いできません",
          },
          events: {
            afterRender: (product: ProductObject) => {
              handleSku({
                type: "reset",
                variant: variants.find(
                  ({ variantId }) =>
                    variantId ===
                    product.selectedVariantTrackingInfo.id.replace(
                      "gid://shopify/ProductVariant/",
                      ""
                    )
                ),
              });
              target.current = document
                .getElementsByClassName(
                  "shopify-buy__product__variant-selectors"
                )[0]!
                .appendChild(document.createElement("div"));
            },
            addVariantToCart: (product: ProductObject) => {
              if (window.ShopifyCustomAttribute)
                product.setCustomAttributes(window.ShopifyCustomAttribute);
            },
          },
        },
        cart: {
          styles: {
            button: {
              "font-size": "17px",
              "padding-top": "16.5px",
              "padding-bottom": "16.5px",
              ":hover": {
                "background-color": "#a4514e",
              },
              "background-color": "#b65a57",
              ":focus": {
                "background-color": "#a4514e",
              },
            },
          },
          text: {
            title: "カートリスト",
            total: "小計",
            empty: "カートに何も入っていません",
            notice: "送料無料 - 期間限定割引 適用済み",
            button: "購入手続きへ進む",
          },
          popup: false,
          events: {
            afterInit: (cart: CartObject) => {
              cart.onCheckout = () => {
                const url = new URL(cart.model.webUrl);
                Array.from(new URL(location.href).searchParams).forEach(
                  ([key, value]) => {
                    if (key.startsWith("utm_"))
                      url.searchParams.append(key, value);
                  }
                );
                cart.checkout.open(url.toString());
              };
            },
          },
        },
        toggle: {
          styles: {
            toggle: {
              "background-color": "#b65a57",
              ":hover": {
                "background-color": "#a4514e",
              },
              ":focus": {
                "background-color": "#a4514e",
              },
            },
            count: {
              "font-size": "17px",
            },
          },
        },
      },
    });
  };
