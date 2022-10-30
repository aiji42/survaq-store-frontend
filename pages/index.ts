import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.headers.host)
    return {
      notFound: true,
    };

  const res = await fetch(
    `${process.env.SURVAQ_API_ORIGIN}/products/page-data/by-domain/${req.headers.host}`
  );
  if (!res.ok)
    return {
      notFound: true,
    };

  const data = await res.json();

  if (data.pageData?.pathname)
    return {
      redirect: {
        destination: `/${data.pageData.pathname}`,
        statusCode: 302,
      },
    };

  return {
    notFound: true,
  };
};

export default () => null;
