import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { navbarHeight } from "../common/Layout";
import { TargetSizing } from "./TargetSizing";
import { useMemo } from "react";
import numeral from "numeral";

import type { FC } from "react";
import type { DrawerProps } from "@mui/material";

import CreamAccounts from "src/data/cream-never-aave.json";
import EulerAccounts from "src/data/euler-never-aave.json";

import { useNetwork } from "wagmi";

type Props = {
  value: string;
  width?: number;
  onCancel: () => void | Promise<void>;
  onConfirm: (addresses: string[]) => void | Promise<void>;
} & DrawerProps;

export const CreateCampaignAudienceDrawer: FC<Props> = ({
  value,
  onCancel,
  onConfirm,
  width = 387,
  ...props
}) => {
  const testUsersAccount: string[] = useMemo(() => {
    return [
      "0x929Aa59D8bA002258Fc9CAEd9303f96E1aba3C5c",
      "0xD38613B1c1fD6c7A8031c7F30D935918142f9a40",
      "0xd92b2bdfcefb64475870338E4AB74D589449493a",
      "0x70589220023a0A4075923B96e6f2188464eFBce3",
      "0xC03F2d02Bd611d16772263484ea052Fa1D240cE9",
      "0xEfBbE421caA36fA74E10ba0b5b277EDf83746cE9",
    ];
  }, []);

  const audienceAddresses = useMemo(() => {
    switch (value) {
      case "test-users":
        return testUsersAccount;
      case "aave-users":
        return Array.from<string>({ length: 93889 }).fill("");
      case "compound-never-aave":
        return Array.from<string>({ length: 382057 }).fill("");
      case "cream-never-aave":
        return CreamAccounts;
      case "euler-never-aave":
        return EulerAccounts;
      default:
        return [];
    }
  }, [value, testUsersAccount, EulerAccounts, CreamAccounts]);

  const targetSizingIndex = useMemo(() => {
    switch (value) {
      case "test-users":
        return 0;
      case "aave-users":
        return 2;
      case "compound-never-aave":
        return 2;
      case "cream-never-aave":
        return 0;
      case "euler-never-aave":
        return 1;
      default:
        return 0;
    }
  }, [value]);

  const network = useNetwork();

  const audienceTitle = useMemo(() => {
    if (value === "test-users") {
      return "Test group";
    }
    return `${value.split("-")[0].capitalize()} users who never used Aave`;
  }, [value]);

  const sourceProtocol = value.split("-")[0].capitalize();

  return (
    <Drawer
      {...props}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          mt: `${navbarHeight}px`,
        },
      }}
      variant="persistent"
      anchor="right"
    >
      <Box height="100%">
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          py={3.5}
          pl={3.75}
          pr={9}
        >
          <Typography variant="h5">Audience Details</Typography>
          <IconButton size="small" sx={{ color: "#3876FF" }} disableRipple onClick={onCancel}>
            <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </IconButton>
        </Box>
        <Divider />
        <Box py={3.5} pl={3.75} pr={9}>
          <Stack spacing={2}>
            <Typography variant="h6">{audienceTitle}</Typography>
            {value === "test-users" ? (
              <>
                <Box maxWidth={250}>
                  <Typography sx={{ color: "#2263FF" }}>
                    <b>Test user:</b>
                  </Typography>
                  <Typography>Closed-group test users</Typography>
                </Box>
              </>
            ) : (
              <>
                <Box maxWidth={250}>
                  <Typography sx={{ color: "#2263FF" }}>
                    <b>{sourceProtocol} user:</b>
                  </Typography>
                  <Typography>having an active position(s) on {sourceProtocol}</Typography>
                </Box>
                <Box maxWidth={250}>
                  <Typography sx={{ color: "#2263FF" }}>
                    <b>Who never used Aave:</b>
                  </Typography>
                  <Typography>never have a position on Aave</Typography>
                </Box>
              </>
            )}
          </Stack>
          <Box mt={5}>
            <Typography variant="h6">Target Sizing</Typography>
            <TargetSizing activeIndex={targetSizingIndex} />
            <Typography sx={{ mt: 2 }}>
              Estimated audience size:{" "}
              <Typography component="span" sx={{ color: "#5A80E6" }}>
                {numeral(audienceAddresses?.length || 0).format("0,0")} addresses
              </Typography>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={5}>
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: 8, height: 32, width: 112 }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2263FF",
                borderRadius: 8,
                height: 32,
                width: 112,
                color: "white",
              }}
              onClick={() => onConfirm(audienceAddresses)}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
