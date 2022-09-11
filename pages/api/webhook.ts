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
      } | null;
    } | null;
    new: {
      publishValue: {
        productCode: string;
      } | null;
    } | null;
  };
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const body: Body = req.body;
    if (body.api !== "products") return res.status(200).send({});
    if (
      body.contents.old?.publishValue?.productCode ===
      body.contents.new?.publishValue?.productCode
    ) {
      await res.revalidate(`/${body.contents.new?.publishValue?.productCode}`);
      console.log(
        "revalidate",
        `/${body.contents.new?.publishValue?.productCode}`
      );
    }
    if (
      body.contents.old?.publishValue?.productCode &&
      body.contents.old.publishValue.productCode !==
        body.contents.new?.publishValue?.productCode
    ) {
      await res.revalidate(`/${body.contents.old.publishValue.productCode}`);
      console.log(
        "revalidate",
        `/${body.contents.old.publishValue.productCode}`
      );
    }
    if (
      body.contents.new?.publishValue?.productCode &&
      body.contents.old?.publishValue?.productCode !==
        body.contents.new.publishValue.productCode
    ) {
      await res.revalidate(`/${body.contents.new.publishValue.productCode}`);
      console.log(
        "revalidate",
        `/${body.contents.new.publishValue.productCode}`
      );
    }

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(200).send("Error revalidating");
  }
};

export default handler;
