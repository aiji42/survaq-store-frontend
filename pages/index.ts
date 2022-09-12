import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.headers.host)
    return {
      notFound: true,
    };

  const res = await fetch(
    "https://survaq-api-production.aiji422990.workers.dev/products/page-data/by-domain/" +
      req.headers.host
  );
  if (!res.ok)
    return {
      notFound: true,
    };

  const data = await res.json();

  if (data.productCode)
    return {
      redirect: {
        destination: `/${data.productCode}`,
        statusCode: 302,
      },
    };

  return {
    notFound: true,
  };
};

export default () => null;
