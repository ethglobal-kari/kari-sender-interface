import nextConnect from "next-connect";
import multer from "multer";
import { Readable } from "stream";
import { pinata } from "src/libs/pinata";

import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnect();

apiRoute.use(
  multer({
    limits: {
      fileSize: 1024 * 1014, // 1 MB
    },
  }).single("file"),
);

type NextApiRequestWithFile = NextApiRequest & {
  file: Express.Multer.File;
};

const handler = async (req: NextApiRequestWithFile, res: NextApiResponse<any>) => {
  const readable = Readable.from(req.file.buffer);
  // @ts-ignore, // ipfs hack
  readable["path"] = req.file.originalname;

  try {
    const pinataResponse = await pinata.pinFileToIPFS(readable, {});
    res.status(201).json({ ipfsHash: pinataResponse.IpfsHash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
};

apiRoute.post(handler);

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
