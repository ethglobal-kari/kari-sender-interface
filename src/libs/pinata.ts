import PinataSDK from "@pinata/sdk";

export const pinata = PinataSDK(
  process.env.PINATA_API_KEY ?? "",
  process.env.PINATA_SECRET_API_KEY ?? "",
);
