import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import type { FC } from "react";
import axios from "axios";

export type TableData = {
  sid: number;
  subject: string;
  audience: string;
  read: number;
  click: number;
  prizePool: number;
  claimed: number;
  totalAmount: number;
  timestamp: string;
  [key: string]: any;
};

type Props = {
  data: any[];
};

interface MetricData {
  [sid: string]: {
    impressions: number;
    reads: number;
    clicks: number;
  };
}

interface ClaimedData {
  [sid: string]: {
    claimed: number;
  };
}

export const CampaignTable: FC<Props> = ({ data }) => {
  // TODO: fetch impression, read, click from firestore
  // TODO: fetch claimed count from backend or contract
  const [metrics, setMetrics] = useState<MetricData>({});
  const [claimedData, setClaimedData] = useState<ClaimedData>({});
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [isClaimedLoading, setIsClaimedLoading] = useState(false);

  const campaignData = useMemo(() => {
    return data
      .map((campaign) => {
        try {
          return {
            ...campaign,
            message: JSON.parse(campaign.message),
          };
        } catch (e) {
          return null;
        }
      })
      .filter((campaign) => campaign !== null);
  }, [data]);

  useEffect(() => {
    const fetch = async () => {
      if (!campaignData) {
        return;
      }
      setIsMetricsLoading(true);
      const query = campaignData.map((campaign) => `sids=${campaign.sid}`).join("&");
      const { data } = await axios.get(`/api/campaigns/metrics?${query}`);
      setMetrics(data);
      setIsMetricsLoading(false);
    };
    fetch();
  }, [campaignData]);

  useEffect(() => {
    const fetch = async () => {
      if (!campaignData) {
        return;
      }
      setIsClaimedLoading(true);
      const results = await Promise.all(
        campaignData.map(async (campaign) => {
          // const message = JSON.parse(campaign.message);
          try {
            const { data } = await axios.get(
              `https://kari-backend-urcger6jua-as.a.run.app/${campaign.message.incentive.incentiveId}`,
            );
            return {
              [campaign.sid]: {
                claimed: data.claimed,
              },
            };
          } catch (e) {
            console.log(e);
            return {
              [campaign.sid]: {
                claimed: -1,
              },
            };
          }
        }),
      );
      setIsClaimedLoading(false);
      setClaimedData(results.reduce((acc, cur) => ({ ...acc, ...cur }), {}));
    };
    fetch();
  }, [campaignData]);

  const getAudienceValueDescription = (value: string) => {
    switch (value) {
      case "test-users":
        return "Test users";
      default:
        return `${value.split("-")[0].capitalize()} users who never used Aave`;
    }
  };

  return (
    <Box>
      <TableContainer sx={{ maxWidth: 900 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "white" }}>
              <TableCell width={120}>
                <Typography variant="h6">Subject</Typography>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #F2EFEC" }}>
                <Typography variant="h6">Audience</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Impression</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Read</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Link Click</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Prize Pool</Typography>
              </TableCell>
              {/* <TableCell>
                <Typography variant="h6">Claimed</Typography>
              </TableCell> */}
              <TableCell>
                <Typography variant="h6">Sent Date</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignData.map((row: any, index) => {
              const message = row.message;
              if (!message.audience) {
                return null;
              }
              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: "#F6F9FF",
                    ".MuiTableCell-root": {
                      borderBottom: "1px solid #F2EFEC",
                    },
                  }}
                >
                  <TableCell width={120}>
                    <Typography fontWeight="bold" noWrap>
                      {row.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #F2EFEC" }}>
                    <Typography fontWeight="bold" noWrap>
                      {getAudienceValueDescription(message.audience)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {isMetricsLoading ? (
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        sx={{ borderRadius: 4, display: "inline-block" }}
                      />
                    ) : (
                      <Typography sx={{ color: "#2263FF" }}>
                        {metrics[row.sid]?.impressions}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isMetricsLoading ? (
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        sx={{ borderRadius: 4, display: "inline-block" }}
                      />
                    ) : (
                      <Typography sx={{ color: "#2263FF" }}>{metrics[row.sid]?.reads}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {isMetricsLoading ? (
                      <Skeleton
                        variant="rectangular"
                        width={40}
                        sx={{ borderRadius: 4, display: "inline-block" }}
                      />
                    ) : (
                      <Typography sx={{ color: "#2263FF" }}>{metrics[row.sid]?.clicks}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ color: "#2263FF" }}>
                      {message.incentive.total || 0}
                    </Typography>
                  </TableCell>
                  {/* <TableCell align="center">
                    {claimedData[row.sid] && claimedData[row.sid].claimed !== -1 ? (
                      <Typography sx={{ color: "#2263FF" }}>
                        {claimedData[row.sid].claimed} / {message.incentive.usersCount}
                      </Typography>
                    ) : (
                      <Typography>Unavailable</Typography>
                    )}
                  </TableCell> */}
                  <TableCell>
                    <Typography>{dayjs(row.timestamp).format("DD MMM YYYY")}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
