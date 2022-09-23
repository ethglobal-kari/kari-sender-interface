import { Box, Button, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { navbarHeight } from "../common/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { GeneralFilledTextField } from "src/components/inputs/GeneralFilledTextField";
import * as yup from "yup";

import type { ChangeEvent, FC } from "react";
import type { DrawerProps } from "@mui/material";
import { useFormik } from "formik";
import { NumberFormatNumeric } from "src/components/inputs/NumberFormats";

type Props = {
  width?: number;
  onCancel: () => void | Promise<void>;
  onConfirm: (values: {
    total: number;
    usersCount: number;
    amountEach: number;
  }) => void | Promise<void>;
} & DrawerProps;

const validationSchema = yup.object({
  total: yup.number().moreThan(0, "Total must be greater than 0").required("Total is required"),
  usersCount: yup
    .number()
    .moreThan(0, "Divide among must be greater than 0")
    .required("Divide among is required"),

  amountEach: yup
    .number()
    .moreThan(0, "Amount each must be greater than 0")
    .required("Amount each is required"),
});

export const CreateCampaignIncentiveDrawer: FC<Props> = ({
  width = 387,
  onConfirm,
  onCancel,
  ...props
}) => {
  const formik = useFormik({
    initialValues: {
      total: 0,
      usersCount: 0,
      amountEach: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      onConfirm(values);
    },
  });

  const handleChange =
    (field: "total" | "usersCount" | "amountEach") => (e: ChangeEvent<HTMLInputElement>) => {
      const { total, usersCount, amountEach } = formik.values;
      // use formik's handleChange to allow empty values on focused input
      formik.handleChange(e);
      // then update the third field based on the other two
      switch (field) {
        case "total": {
          const newTotal = parseFloat(e.target.value || "0");
          if (usersCount > 0) {
            formik.setFieldValue("amountEach", newTotal / usersCount);
          } else if (amountEach > 0) {
            formik.setFieldValue("usersCount", newTotal / amountEach);
          }
          break;
        }
        case "usersCount": {
          const newUsersCount = parseFloat(e.target.value);
          if (total > 0) {
            if (newUsersCount > 0) {
              formik.setFieldValue("amountEach", total / newUsersCount);
            } else {
              formik.setFieldValue("amountEach", 0);
            }
          } else if (amountEach > 0) {
            formik.setFieldValue("total", newUsersCount * amountEach);
          }
          break;
        }
        case "amountEach": {
          const newAmountEach = parseFloat(e.target.value);
          if (total > 0) {
            if (newAmountEach > 0) {
              formik.setFieldValue("usersCount", total / newAmountEach);
            } else {
              formik.setFieldValue("usersCount", 0);
            }
          } else if (usersCount > 0) {
            formik.setFieldValue("total", usersCount * newAmountEach);
          }
          break;
        }
      }
    };

  return (
    <Drawer
      {...props}
      sx={{
        width,
        ".MuiDrawer-paper": {
          width,
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
          <Typography variant="h5">Attach Incentive</Typography>
          <IconButton size="small" sx={{ color: "#3876FF" }} disableRipple onClick={onCancel}>
            <FontAwesomeIcon icon={faArrowRight} size="sm" />
          </IconButton>
        </Box>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Box py={3.5} pl={3.75} pr={9}>
            <Stack spacing={2} width={275}>
              <Box>
                <Typography>How much you want to giveaway</Typography>
                <Box
                  display="grid"
                  sx={{
                    gridTemplateColumns: "1fr 60px",
                    columnGap: 2,
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <GeneralFilledTextField
                    small
                    name="total"
                    value={formik.values.total}
                    error={formik.touched.total && Boolean(formik.errors.total)}
                    helperText={formik.touched.total && formik.errors.total}
                    onChange={handleChange("total")}
                    InputProps={{
                      inputComponent: NumberFormatNumeric as any,
                    }}
                  />
                  <Typography textAlign="right">USDT</Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Divide among</Typography>
                <Box
                  display="grid"
                  sx={{
                    gridTemplateColumns: "1fr 60px",
                    columnGap: 2,
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <GeneralFilledTextField
                    small
                    name="usersCount"
                    value={formik.values.usersCount}
                    error={formik.touched.usersCount && Boolean(formik.errors.usersCount)}
                    helperText={formik.touched.usersCount && formik.errors.usersCount}
                    onChange={handleChange("usersCount")}
                    InputProps={{
                      inputComponent: NumberFormatNumeric as any,
                    }}
                  />
                  <Typography textAlign="right">USERS</Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Amount each user</Typography>
                <Box
                  display="grid"
                  sx={{
                    gridTemplateColumns: "1fr 60px",
                    columnGap: 2,
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <GeneralFilledTextField
                    small
                    name="amountEach"
                    value={formik.values.amountEach}
                    error={formik.touched.amountEach && Boolean(formik.errors.amountEach)}
                    helperText={formik.touched.amountEach && formik.errors.amountEach}
                    onChange={handleChange("amountEach")}
                    InputProps={{
                      inputComponent: NumberFormatNumeric as any,
                    }}
                  />
                  <Typography textAlign="right">USDT</Typography>
                </Box>
              </Box>
            </Stack>
            <Box display="flex" justifyContent="space-between" mt={5} width={275}>
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
                type="submit"
                sx={{
                  backgroundColor: "#2263FF",
                  borderRadius: 8,
                  height: 32,
                  width: 112,
                  color: "white",
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};
