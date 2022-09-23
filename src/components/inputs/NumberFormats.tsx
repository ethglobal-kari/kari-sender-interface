import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";

import type { ChangeEvent } from "react";

interface Values {
  formattedValue: string;
  value: string;
  floatValue: number;
}
export const NumberFormatNumeric = forwardRef<
  typeof NumericFormat,
  { onChange: ChangeEvent<HTMLInputElement>; name: string }
>(function NumberFormatNumeric(props: any, ref) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onChange={onChange}
      onValueChange={(values: Values) => {
        onChange?.({ target: { name: props.name, value: values.floatValue } });
      }}
      thousandSeparator
    />
  );
});
