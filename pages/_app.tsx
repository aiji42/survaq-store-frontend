import "@/styles/reset.css";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <Header logo={pageProps.product.pageData.logo} />
      <main className="item_main_content">
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  );
}

export default MyApp;
