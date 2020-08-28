import { TextField, TextFieldProps } from "@material-ui/core";
import React, { ChangeEvent, forwardRef, ForwardRefRenderFunction, useMemo } from "react";

type FormatedTextFieldProps<T> = TextFieldProps & {
  decode: (value: string) => T;
  encode?: (value: T) => string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => any;
};

type IRef<T> = Parameters<ForwardRefRenderFunction<T>>[1];
export const FormattedTextField = forwardRef(<T extends unknown>(props: FormatedTextFieldProps<T>, ref: IRef<T>) => {
  const { encode = String, decode, value, defaultValue, onChange, ...rest } = props;
  const handleClick = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(decode(e.target.value));
    },
    [onChange, decode]
  );
  const textFieldProps: TextFieldProps = rest;
  if (value != null) textFieldProps.value = encode(value);
  if (defaultValue != null) textFieldProps.defaultValue = encode(defaultValue);
  return <TextField {...textFieldProps} ref={ref as any} onChange={handleClick} />;
});

export const decodeArray = (value: string) => value.split(",");
