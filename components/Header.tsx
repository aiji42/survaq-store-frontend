import Image from "next/legacy/image";
import { ProductPageData } from "@/libs/getProduct";

export const Header = (propduct: ProductPageData) => {
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
