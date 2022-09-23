import {
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputBase,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { useId, useMemo, useState } from "react";
import { GeneralFilledTextField } from "src/components/inputs/GeneralFilledTextField";
import { useMuiTheme } from "src/hooks/themes";
import * as yup from "yup";
import styled from "@emotion/styled";
import { GeneralSelect } from "src/components/inputs/GeneralSelect";
import { CreateCampaignAudienceDrawer } from "../CreateCampaignAudienceDrawer";
import { CreateCampaignIncentiveDrawer } from "../CreateCampaignIncentiveDrawer";
import Link from "next/link";
import { useAsyncMemo } from "src/hooks/useAsyncMemo";
import { getDataUrl } from "src/utils/fileUtil";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { CreateCampaignConfirmDialog } from "../CreateCampaignConfirmDialog";
import numeral from "numeral";
import CreamAccounts from "src/data/cream-never-aave.json";
import EulerAccounts from "src/data/euler-never-aave.json";

import type { NextPage } from "next";

const drawerWidth = 387;

const Content = styled("div", { shouldForwardProp: (prop: string) => !["open"].includes(prop) })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3.5),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const validationSchema = yup.object({
  subject: yup.string().required("Subject is required"),
  audience: yup
    .string()
    .notOneOf(["none"], "Audience is required")
    .required("Audience is required"),
  incentive: yup.object({
    total: yup.number().moreThan(0).required(),
    usersCount: yup.number().moreThan(0).required(),
    amountEach: yup.number().moreThan(0).required(),
  }),
  content: yup.string().required("Content is required"),
  image: yup.mixed().required("Image is required"),
});

export const CreateCampaignPage: NextPage = () => {
  const [audienceDrawerOpen, setAudienceDrawerOpen] = useState(false);
  const [incentiveDrawerOpen, setIncentiveDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [audienceAddresses, setAudienceAddresses] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const theme = useMuiTheme();
  const subjectId = useId();
  const audienceId = useId();
  const incentiveId = useId();
  const contentId = useId();

  const formik = useFormik({
    initialValues: {
      subject: "",
      audience: "none",
      incentive: {
        total: 0,
        usersCount: 0,
        amountEach: 0,
      },
      content: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (_values) => {
      setConfirmDialogOpen(true);
      // await onConfirm();
    },
  });

  const incentiveText = useMemo(() => {
    const incentive = formik.values.incentive;
    if (incentive.total === 0 || incentive.usersCount === 0 || incentive.amountEach === 0) {
      return "";
    }
    return `Split ${numeral(incentive.total).format("0,0")} USDT among ${numeral(
      incentive.usersCount,
    ).format("0,0")} users (${numeral(incentive.amountEach).format("0,0.[0000]")} USDT each)`;
  }, [formik.values.incentive]);

  const selectedFileDataUrl = useAsyncMemo(async () => {
    if (!selectedFile) return "";
    return getDataUrl(selectedFile);
  }, [selectedFile]);

  const audienceSize = (value: string) => {
    switch (value.split("-")[0]) {
      case "compound":
        return 382057;
      case "cream":
        return CreamAccounts.length;
      case "euler":
        return EulerAccounts.length;
      default:
        return 0;
    }
  };

  const getAudienceValueDescription = (value: string) => {
    switch (value) {
      case "test-users":
        return "Test users (6)";
      case "aave-users":
        return "Aave users (93,889)";
      default:
        return `${value.split("-")[0].capitalize()} users who never used Aave (${numeral(
          audienceSize(value),
        ).format("0,0")})`;
    }
  };

  return (
    <>
      <Box>
        <Content open={audienceDrawerOpen || incentiveDrawerOpen}>
          <Box display="flex" alignItems="center">
            <Link href="/" passHref>
              <IconButton size="small" sx={{ color: "#3876FF", mr: 3 }}>
                <FontAwesomeIcon icon={faArrowLeft} size="sm" />
              </IconButton>
            </Link>
            <Typography variant="h5">Create Campaign</Typography>
          </Box>
          <Card elevation={0} sx={{ mt: 3.625, width: "100%", maxWidth: 750, borderRadius: 8 }}>
            <Box py={3} px={4}>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={1}>
                  <Box>
                    <label htmlFor={subjectId}>
                      <Typography variant="h6">Subject</Typography>
                    </label>
                    <GeneralFilledTextField
                      fullWidth
                      id={subjectId}
                      name="subject"
                      placeholder="Subject of your campaign"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      error={formik.touched.subject && Boolean(formik.errors.subject)}
                      helperText={formik.touched.subject && formik.errors.subject}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  <Box>
                    <label htmlFor={audienceId}>
                      <Typography variant="h6">Audience</Typography>
                    </label>
                    <FormControl fullWidth>
                      <GeneralSelect
                        fullWidth
                        id={audienceId}
                        name="audience"
                        placeholder="Choose your target audience"
                        value={formik.values.audience}
                        onChange={formik.handleChange}
                        error={formik.touched.audience && Boolean(formik.errors.audience)}
                        sx={{ mt: 0.5 }}
                        renderValue={(value) => {
                          const isPlaceholder = value === "none";
                          return (
                            <Typography
                              sx={{
                                color: isPlaceholder ? "#D9D9D9" : "textPrimary",
                                fontSize: 18,
                                lineHeight: 1.5,
                              }}
                            >
                              {isPlaceholder
                                ? `Choose your target audience`
                                : getAudienceValueDescription(formik.values.audience)}
                            </Typography>
                          );
                        }}
                      >
                        <MenuItem disabled value="none">
                          <Typography>Choose your target audience</Typography>
                        </MenuItem>
                        <MenuItem
                          value="test-users"
                          onClick={() => {
                            setIncentiveDrawerOpen(false);
                            setAudienceDrawerOpen(true);
                          }}
                        >
                          <Typography>{getAudienceValueDescription("test-users")}</Typography>
                        </MenuItem>
                        <MenuItem
                          value="aave-users"
                          onClick={() => {
                            setIncentiveDrawerOpen(false);
                            setAudienceDrawerOpen(true);
                          }}
                        >
                          <Typography>{getAudienceValueDescription("aave-users")}</Typography>
                        </MenuItem>
                        <MenuItem
                          value="compound-never-aave"
                          onClick={() => {
                            setIncentiveDrawerOpen(false);
                            setAudienceDrawerOpen(true);
                          }}
                        >
                          <Typography>
                            {getAudienceValueDescription("compound-never-aave")}
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          value="cream-never-aave"
                          onClick={() => {
                            setIncentiveDrawerOpen(false);
                            setAudienceDrawerOpen(true);
                          }}
                        >
                          <Typography>{getAudienceValueDescription("cream-never-aave")}</Typography>
                        </MenuItem>
                        <MenuItem
                          value="euler-never-aave"
                          onClick={() => {
                            setIncentiveDrawerOpen(false);
                            setAudienceDrawerOpen(true);
                          }}
                        >
                          <Typography>{getAudienceValueDescription("euler-never-aave")}</Typography>
                        </MenuItem>
                      </GeneralSelect>
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {formik.errors.audience}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                  <Box>
                    <label htmlFor={incentiveId}>
                      <Typography variant="h6">Attach Incentive</Typography>
                    </label>
                    <GeneralFilledTextField
                      fullWidth
                      id={incentiveId}
                      name="incentive"
                      placeholder="Give airdrop to your target audience"
                      // value={formik.values.incentive}
                      value={incentiveText}
                      // onChange={formik.handleChange}
                      error={formik.touched.incentive && Boolean(formik.errors.incentive)}
                      helperText={
                        formik.touched.incentive &&
                        Boolean(formik.errors.incentive) &&
                        "Incentive is required"
                      }
                      sx={{ mt: 0.5 }}
                      onClick={() => {
                        if (incentiveDrawerOpen) {
                          return;
                        }
                        setAudienceDrawerOpen(false);
                        setIncentiveDrawerOpen(true);
                      }}
                    />
                  </Box>
                  <Box>
                    <label htmlFor={contentId}>
                      <Typography variant="h6">Content</Typography>
                    </label>
                    <GeneralFilledTextField
                      fullWidth
                      multiline
                      id={contentId}
                      name="content"
                      placeholder="Details about the campaign"
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      error={formik.touched.content && Boolean(formik.errors.content)}
                      helperText={formik.touched.content && formik.errors.content}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  {selectedFileDataUrl ? (
                    <Box
                      sx={{
                        width: 200,
                        height: 200,
                        position: "relative",
                        "& > *": {
                          width: "100%",
                          height: "100%",
                          borderRadius: 8,
                          transition: ".35s ease",
                        },
                        ":hover": {
                          "& img": {
                            opacity: 0.5,
                          },
                          "& button": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Box component="img" src={selectedFileDataUrl} />
                      <Button
                        variant="text"
                        sx={{
                          display: "flex",
                          position: "absolute",
                          top: 0,
                          opacity: 0,
                          color: "#666",
                        }}
                        onClick={() => {
                          setSelectedFile(null);
                          formik.setFieldValue("image", null);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} size="6x" />
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ color: "#D9D9D9" }}>
                        <FontAwesomeIcon icon={faImage} size="6x" />
                      </Box>
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {formik.errors.image}
                      </FormHelperText>
                    </Box>
                  )}
                  <Box>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ borderRadius: 8, backgroundColor: "#C9C9C9" }}
                    >
                      Upload Image
                      <InputBase
                        type="file"
                        inputProps={{ accept: "image/*", hidden: true }}
                        sx={{ display: "none" }}
                        hidden={true}
                        value={""}
                        onChange={(e) => {
                          const file = (e.target as any).files?.[0];
                          formik.setFieldValue("image", file);
                          setSelectedFile(file);
                        }}
                        error={formik.touched.image && Boolean(formik.errors.image)}
                      />
                    </Button>
                  </Box>
                </Stack>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      mt: 5,
                      borderRadius: 8,
                      width: 170,
                      background: theme.palette.gradient.linear.primary,
                    }}
                  >
                    <Typography variant="button" color="white">
                      Confirm
                    </Typography>
                  </Button>
                </Box>
              </form>
            </Box>
          </Card>
        </Content>
        {/* Drawers */}
        <CreateCampaignAudienceDrawer
          value={formik.values.audience}
          width={drawerWidth}
          open={audienceDrawerOpen}
          onClose={() => {
            formik.setFieldValue("audience", "none");
            setAudienceDrawerOpen(false);
          }}
          onCancel={() => {
            formik.setFieldValue("audience", "none");
            setAudienceDrawerOpen(false);
          }}
          onConfirm={(addresses) => {
            setAudienceDrawerOpen(false);
            setAudienceAddresses(addresses);
          }}
        />
        <CreateCampaignIncentiveDrawer
          width={drawerWidth}
          open={incentiveDrawerOpen}
          onCancel={() => {
            setIncentiveDrawerOpen(false);
          }}
          onConfirm={(values) => {
            formik.setFieldValue("incentive", values);
            setIncentiveDrawerOpen(false);
          }}
        />
      </Box>
      <CreateCampaignConfirmDialog
        open={confirmDialogOpen}
        imageSrc={selectedFileDataUrl}
        onClose={() => setConfirmDialogOpen(false)}
        subject={formik.values.subject}
        audience={formik.values.audience}
        incentive={formik.values.incentive}
        content={formik.values.content}
        attachment={formik.values.image}
        audienceAddresses={audienceAddresses}
        incentiveText={incentiveText}
      />
    </>
  );
};
