import Image from "next/image";

export const Header = ({
  logo,
}: {
  logo: { url: string; height: number; width: number };
}) => {
  return (
    <header className="item_header">
      <div className="item_logo">
        <Image
          src={logo.url}
          height={logo.height}
          width={logo.width}
          alt="logo"
          priority
        />
      </div>
    </header>
  );
};
