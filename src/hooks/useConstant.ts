import { useMemo } from "react";
import { addresses } from "src/components/constants/address";
import { useNetwork } from "wagmi";

export const useConstant = () => {
  const network = useNetwork();

  const chainID = network.chain?.id || 42;

  return useMemo(
    () => ({
      address: addresses[chainID],
    }),
    [chainID],
  );
};
