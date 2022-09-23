import { chain } from "wagmi";

export const addresses = {
  [chain.mainnet.id]: {
    chatWalletAddress: "",
    usdt: "",
  },
  [chain.kovan.id]: {
    chatWalletAddress: "",
    usdt: "0xe0BB0D3DE8c10976511e5030cA403dBf4c25165B",
  },
};
