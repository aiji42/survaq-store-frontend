import Image from "next/legacy/image";
import { ProductPageData } from "@/libs/getProduct";

export const Header = ({ logo }: { logo?: ProductPageData["logo"] }) => {
  return (
    <header className="item_header">
      {logo && (
        <Image
          src={logo.url}
          height={logo.height}
          width={logo.width}
          alt="logo"
          priority
        />
      )}
    </header>
  );
};
