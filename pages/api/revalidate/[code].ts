import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    await res.revalidate(`/${req.query.code}`);
    console.log("revalidated", `/${req.query.code}`);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(200).send("Error revalidate");
  }
};

export default handler;
