import { Box, Button, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { shortenAddress } from "src/utils/walletUtils";

export const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const isReady = mounted && authenticationStatus !== "loading";
        const connected =
          isReady &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <Box
            aria-hidden={isReady ? "false" : "true"}
            sx={{
              ...(!isReady && {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              }),
            }}
          >
            {!connected && (
              <Button
                variant="contained"
                onClick={openConnectModal}
                color="primary"
                sx={{ height: 40, borderRadius: 999 }}
              >
                <Typography variant="button" color="white">
                  Connect Wallet
                </Typography>
              </Button>
            )}
            {connected && (
              <>
                {chain.unsupported ? (
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ borderRadius: 999 }}
                    onClick={openChainModal}
                  >
                    <Typography variant="button">Wrong Network</Typography>
                  </Button>
                ) : (
                  // Connected with Supported Chain ID
                  <Box style={{ display: "flex", gap: 12 }}>
                    <Button
                      variant="contained"
                      sx={{ height: 40, backgroundColor: "common.white", borderRadius: 999 }}
                      startIcon={
                        chain.hasIcon && (
                          <Box
                            sx={{
                              background: chain.iconBackground,
                              width: 24,
                              height: 24,
                              overFlow: "hidden",
                              borderRadius: 999,
                            }}
                          >
                            {chain.iconUrl && (
                              <Box
                                component="img"
                                src={chain.iconUrl}
                                sx={{ width: 24, height: 24 }}
                              />
                            )}
                          </Box>
                        )
                      }
                      onClick={openChainModal}
                    >
                      {chain.name}
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "common.white", borderRadius: 999, height: 40 }}
                      onClick={openAccountModal}
                    >
                      <Typography variant="button">{account.displayBalance}</Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ ml: 1.5, backgroundColor: "#EEE", borderRadius: 8, px: 1, py: 0.5 }}
                      >
                        {account.ensAvatar && (
                          <Box
                            component="img"
                            src={account.ensAvatar}
                            sx={{ mr: 1, width: 24, height: 24, borderRadius: 999 }}
                          />
                        )}
                        <Typography variant="button" textTransform="none">
                          {account.ensName ?? shortenAddress(account.address)}
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
