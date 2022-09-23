import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { CampaignTable } from "../CampaignTable";
import * as EpnsApi from "@epnsproject/sdk-restapi";

import type { NextPage } from "next";
import { useAccount, useNetwork } from "wagmi";

export const DashboardPage: NextPage = () => {
  const account = useAccount();
  const network = useNetwork();

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!account?.address) {
        return;
      }
      const feedResponse = await EpnsApi.user.getFeeds({
        user: account?.address,
        env: "staging",
      });
      setCampaigns(feedResponse);
    };
    fetch();
  }, [account?.address, network?.chain?.id]);

  return (
    <Box py={3} px={3.5}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Campaigns
      </Typography>
      <CampaignTable data={campaigns} />
    </Box>
  );
};
