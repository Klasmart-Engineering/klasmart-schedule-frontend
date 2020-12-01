import { TextField, TextFieldProps } from "@material-ui/core";
import React, { ChangeEvent, forwardRef, ForwardRefRenderFunction, useMemo } from "react";

interface FormatedTextFieldProps<T> extends Omit<TextFieldProps, "onChange" | "value" | "defaultValue" | "variant"> {
  decode: (value: string) => T;
  encode?: (value: T) => string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => any;
}

type IRef<T> = Parameters<ForwardRefRenderFunction<T>>[1];
// todo: 移除 any
export const FormattedTextField = forwardRef((props: FormatedTextFieldProps<any>, ref: IRef<any>) => {
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
export const encodeOneItemArray = (value: string[]): string => value[0] || "";
export const decodeOneItemArray = (value: string): string[] => (value ? [value] : []);
export const frontTrim = (value: string): string => value.replace(/^[\s\n\t]+/g, "");
