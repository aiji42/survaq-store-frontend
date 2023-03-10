import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const runtime = "experimental-edge";

export default async () => {
  const host = headers().get("host");

  const res = await fetch(
    `${process.env.SURVAQ_API_ORIGIN}/products/page-data/by-domain/${host}/supabase`,
    { cache: "no-store" }
  );
  if (res.status === 404) return notFound();
  if (res.status !== 200) throw new Error(await res.text());

  const json = (await res.json()) as { pathname: string };

  return redirect(json.pathname);
};
