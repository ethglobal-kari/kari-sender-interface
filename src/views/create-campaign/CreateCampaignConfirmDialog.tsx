import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { PrimaryGradientButton } from "src/components/buttons/PrimaryGradientButton";
import axios from "axios";
import dayjs from "dayjs";
import { useAccount, useNetwork, useSigner } from "wagmi";
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import { EpnsType } from "src/enums/epns.enum";
import Link from "next/link";
import { useConstant } from "src/hooks/useConstant";
import { bn } from "src/utils/bignumber";

import type { FC } from "react";
import type { DialogProps } from "@mui/material";
import type { CreateIncentiveResponseData } from "src/interfaces/incentive";
import numeral from "numeral";
import { nanoid } from "nanoid";

type Props = {
  imageSrc?: string;
  subject: string;
  audience: string;
  incentive: {
    total: number;
    usersCount: number;
    amountEach: number;
  };
  content: string;
  attachment: any;
  incentiveText: string;
  audienceAddresses: string[];
} & DialogProps;

export const CreateCampaignConfirmDialog: FC<Props> = ({
  imageSrc,
  subject,
  audience,
  incentive,
  content,
  attachment,
  incentiveText,
  audienceAddresses,
  ...dialogProps
}) => {
  const [step, setStep] = useState(0);
  const [ipfsUploadState, setIpfsUploadState] = useState<
    "awaiting" | "uploading" | "success" | "error"
  >("awaiting");
  const [ipfsHash, setIpfsHash] = useState("");
  const [incentiveCreateState, setIncentiveCreateState] = useState<
    "awaiting" | "pending" | "success" | "error"
  >("awaiting");
  const [incentiveResponseData, setIncentiveResponseData] = useState<CreateIncentiveResponseData>(
    {} as any,
  );

  const constant = useConstant();

  const network = useNetwork();
  const account = useAccount();
  const signer = useSigner();

  const getAudienceValueDescription = (value: string) => {
    switch (value) {
      case "test-users":
        return "Test users";
      default:
        return `${value.split("-")[0].capitalize()} users who never used Aave`;
    }
  };

  const handlePinFile = async (): Promise<void> => {
    setIpfsUploadState("uploading");
    try {
      const formData = new FormData();
      formData.append("file", attachment);
      const { data } = await axios.post<{ ipfsHash: string }>("/api/pin-ipfs", formData);
      const { ipfsHash } = data;
      setIpfsHash(ipfsHash);
      setIpfsUploadState("success");
      setStep(1);
      // return ipfsHash;
    } catch (_e) {
      setIpfsUploadState("error");
    }
  };

  const handleCreateIncentive = async (): Promise<void> => {
    const token =
      network.chain?.id === 42
        ? "0x7c0046E7e98251c89c0A43971fbF5e20e70c00A4"
        : network.chain?.id === 80001
        ? "0x661cDEBf1C046b633e077544d057Bde5C1df7eD8"
        : "0x661cDEBf1C046b633e077544d057Bde5C1df7eD8";
    const body = {
      chainId: network.chain?.id,
      // tokenAddress: constant.address.usdt,
      tokenAddress: token,
      audienceSize: incentive.usersCount,
      totalAmount: bn(incentive.total).times(1e6).toString(),
      audienceId: "test-users", // TODO: only one available now
    };
    setIncentiveCreateState("pending");
    try {
      const { data } = await axios.post<CreateIncentiveResponseData>(
        `https://kari-backend-urcger6jua-as.a.run.app/incentive/create`,
        body,
      );
      setIncentiveResponseData(data);
      setStep(2);
      setIncentiveCreateState("success");
    } catch {
      setIncentiveCreateState("error");
      // pass
    }
  };

  const handleCreateCampaign = async () => {
    const chainId = network?.chain?.id;
    // const channelAddress = `0xDF3B63F29332E96C0175CC45a5E7d973FcbB68de`;
    const channelAddress = `0x70589220023a0A4075923B96e6f2188464eFBce3`;

    if (!chainId || !channelAddress) {
      console.debug("Invalid chainId or channelAddress");
    }

    // TODO: re enable this on release (audience too large)
    const selfRecipient = `eip155:${chainId}:${account.address}`;
    // const recipients = [`eip155:${chainId}:0x96546DeadDCBb28fa917eF29E2EF1D5a8FEc7794`];
    const recipients = audienceAddresses.map((addr) => `eip155:${chainId}:${addr}`);
    try {
      const _apiResponse = await EpnsAPI.payloads.sendNotification({
        signer: signer.data,
        type: EpnsType.Subset,
        identityType: 2, // direct payload
        notification: {
          title: subject,
          body: content,
        },
        payload: {
          // ? -> field `message` on receiver side
          title: subject,
          body: JSON.stringify({
            id: nanoid(10),
            protocol: {
              name: "AAVE Protocol",
              address: "",
              logo: "https://cryptologos.cc/logos/aave-aave-logo.png",
            },
            // subject: subject,
            // content: content,
            incentive: {
              ...incentive,
              chainId,
              incentiveId: incentiveResponseData.incentiveId,
            },
            audience,
            attachment: `ipfs://${ipfsHash}`,
            timestamp: dayjs().unix(),
          }),
          cta: "https://aave.com/",
          img: `ipfs://${ipfsHash}`,
        },
        recipients: [...recipients, selfRecipient], // recipients addresses
        channel: `eip155:${chainId}:${channelAddress}`, // your channel address
        env: chainId === 1 ? "production" : "staging",
      });
      setStep(3);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog
      {...dialogProps}
      sx={{
        ".MuiDialog-container > .MuiPaper-root": {
          borderRadius: 16,
          minWidth: 400,
          maxWidth: "70vw",
        },
      }}
    >
      <DialogContent>
        <Stepper
          orientation="vertical"
          activeStep={step}
          sx={{
            ".MuiStepIcon-root": { color: "#3876FF", "&.Mui-completed": { color: "success.main" } },
            text: { color: "white" },
          }}
        >
          <Step>
            <StepLabel>
              <Typography variant="h5">Upload attachment to IPFS</Typography>
            </StepLabel>
            <StepContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  component="img"
                  src={imageSrc}
                  sx={{ height: 150, width: "auto", borderRadius: 6, objectFit: "contain" }}
                />
                <PrimaryGradientButton
                  sx={{
                    minWidth: 150,
                    mt: 2,
                  }}
                  loading={ipfsUploadState === "uploading"}
                  onClick={handlePinFile}
                >
                  {ipfsUploadState === "uploading" ? "Uploading..." : "Upload"}
                </PrimaryGradientButton>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel
              sx={{
                ".MuiStepIcon-root": {
                  color: "#3876FF",
                  text: { color: "white" },
                },
              }}
            >
              <Typography variant="h5">Attach incentive</Typography>
            </StepLabel>
            <StepContent>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Target:</Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  <Typography>{getAudienceValueDescription(audience)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Total amount:</Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  <Typography>{numeral(incentive.total).format("0,0.[0000]")} USDT</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Divide among:</Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  <Typography>{numeral(incentive.usersCount).format("0,0")} Users</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Amount each user:</Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  <Typography>{numeral(incentive.amountEach).format("0,0.[0000]")} USDT</Typography>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="center">
                <PrimaryGradientButton
                  sx={{ mt: 2, width: 150, mx: "auto" }}
                  onClick={handleCreateIncentive}
                  loading={incentiveCreateState === "pending"}
                >
                  {incentiveCreateState === "pending" ? "Processing..." : "Confirm"}
                </PrimaryGradientButton>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              <Typography variant="h5">Create campaign</Typography>
            </StepLabel>
            <StepContent>
              <Stack spacing={0.5}>
                <Box>
                  <Typography variant="h6">Subject:</Typography>
                  <Typography variant="body1">{subject}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Audience:</Typography>
                  <Typography variant="body1">{audience}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Incentive:</Typography>
                  <Typography variant="body1">{incentiveText}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6">Content:</Typography>
                  <Typography variant="body1">{content}</Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6">Attachment:</Typography>
                  <Box alignSelf="flex-start">
                    <Box
                      component="img"
                      src={imageSrc}
                      sx={{ height: 150, width: "auto", objectFit: "contain", borderRadius: 8 }}
                    />
                  </Box>
                </Box>
                <Box display="flex" justifyContent="center">
                  <PrimaryGradientButton sx={{ width: 150 }} onClick={handleCreateCampaign}>
                    Create
                  </PrimaryGradientButton>
                </Box>
              </Stack>
            </StepContent>
          </Step>
          <Step completed={step === 3}>
            <StepLabel>
              <Typography variant="h5">Complete</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="h6" sx={{ px: 0.75 }}>
                Your campaign is created
              </Typography>
              <Link href="/" passHref>
                <Button variant="text">Back to dashboard</Button>
              </Link>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
      {/* <Stack alignItems="center" spacing={2}>
          <Box
            component="img"
            src={imageSrc}
            sx={{
              width: 200,
              height: 200,
              borderRadius: 8,
            }}
          />
          {state === "uploading" && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h5">Uploading IPFS...</Typography>
              <FontAwesomeIcon icon={faCircleNotch} spin size="lg" />
            </Stack>
          )}
          {state === "success" && (
            <>
              <Box>
                <Typography variant="h5" textAlign="center">
                  Upload success
                </Typography>
                <Typography variant="body1" textAlign="center">
                  <Typography component="span">Ipfs hash: </Typography>
                  <Link href={`https://gateway.ipfs.io/ipfs/${ipfsHash}`} passHref>
                    <Typography component="a" target="_blank" rel="noreferrer">
                      {truncateString(ipfsHash, 8, 8)}
                    </Typography>
                  </Link>
                </Typography>
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 5,
                  borderRadius: 8,
                  width: 125,
                  background: theme.palette.gradient.linear.primary,
                }}
                onClick={onContinue}
              >
                <Typography variant="button" color="white">
                  Continue
                </Typography>
              </Button>
            </>
          )}
          {state === "error" && (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5">Upload failed</Typography>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="lg"
                  style={{ color: theme.palette.error.main, fontSize: 22 }}
                />
              </Stack>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  mt: 5,
                  borderRadius: 8,
                  width: 125,
                }}
                onClick={(e) => dialogProps.onClose?.(e, "backdropClick")}
              >
                <Typography variant="button">Close</Typography>
              </Button>
            </>
          )}
        </Stack> */}
    </Dialog>
  );
};
