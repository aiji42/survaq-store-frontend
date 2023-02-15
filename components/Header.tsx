"use client";
import Image from "next/legacy/image";
import { ProductPageData } from "@/libs/getProduct";
import { useReplaceSchedule } from "@/libs/hooks/useReplaceSchedule";

export const Header = (propduct: ProductPageData) => {
  // TODO
  useReplaceSchedule(propduct);
  return (
    <header className="item_header">
      {propduct.logo && (
        <Image
          src={propduct.logo.url}
          height={propduct.logo.height}
          width={propduct.logo.width}
          alt="logo"
          priority
        />
      )}
    </header>
  );
};
