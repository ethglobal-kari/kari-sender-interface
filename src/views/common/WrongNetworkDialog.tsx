import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Dialog, Stack, Typography } from "@mui/material";
import { PrimaryGradientButton } from "src/components/buttons/PrimaryGradientButton";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const WrongNetworkDialog = () => {
  const network = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const isWrongNetwork = network.chain?.id !== 42; // Kovan
  return (
    <Dialog
      open={isWrongNetwork}
      sx={{
        ".MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0,0, 0.9)",
        },
        ".MuiDialog-paper": {
          borderRadius: 16,
        },
      }}
    >
      <Stack px={5} py={3} spacing={2} alignItems="center">
        <Box color="error.main">
          <FontAwesomeIcon icon={faTriangleExclamation} size="4x" />
        </Box>
        <Box>
          <Typography variant="h3" textAlign="center">
            Wrong Network
          </Typography>
          <Typography variant="body1" textAlign="center">
            Please switch to <b>Kovan</b> to use the app
          </Typography>
        </Box>
        <PrimaryGradientButton
          sx={{ width: 180 }}
          onClick={() => switchNetwork?.(42)}
          disabled={isLoading}
        >
          {isLoading && pendingChainId === 42 ? "Switching..." : "Switch Network"}
        </PrimaryGradientButton>
      </Stack>
    </Dialog>
  );
};
