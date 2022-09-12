import { NextApiHandler } from "next";

type Body = {
  service: string;
  api: "products" | "skus" | "schedule";
  id: string | null;
  type: "edit" | "new" | "delete";
  contents: {
    old: {
      publishValue: {
        productCode: string;
        pageData?: {
          domain?: string;
        };
      } | null;
    } | null;
    new: {
      publishValue: {
        productCode: string;
        pageData?: {
          domain?: string;
        };
      } | null;
    } | null;
  };
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const body: Body = req.body;
    if (body.api !== "products") return res.status(200).send({});

    let oldEndpoint: string = "",
      newEndpoint: string = "";

    if (body.contents.old?.publishValue?.pageData?.domain) {
      oldEndpoint = `https://${body.contents.old.publishValue.pageData.domain}/api/revalidate/${body.contents.old.publishValue.productCode}`;
    }
    if (body.contents.new?.publishValue?.pageData?.domain) {
      newEndpoint = `https://${body.contents.new.publishValue.pageData.domain}/api/revalidate/${body.contents.new.publishValue.productCode}`;
    }

    await Promise.all(
      [...new Set([oldEndpoint, newEndpoint])]
        .filter(Boolean)
        .map((endpoint) => fetch(endpoint))
    );

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(200).send("Error webhook");
  }
};

export default handler;
