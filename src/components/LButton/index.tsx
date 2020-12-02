import { Button, ButtonProps, CircularProgress, makeStyles } from "@material-ui/core";
import React, { ComponentType, useEffect, useMemo, useRef, useState } from "react";

const useStyles = makeStyles({
  circle: (props: Partial<LButtonProps>) => ({
    marginRight: props.replace ? 0 : 8,
  }),
});

type AsProps<TAs> = TAs extends undefined
  ? ButtonProps
  : TAs extends React.ComponentType<infer P>
  ? P
  : TAs extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TAs]
  : never;

export type LButtonProps<TAs extends ComponentType<any> | "button" = typeof Button> = Omit<AsProps<TAs>, "onClick"> & {
  onClick: (...args: Parameters<AsProps<TAs>["onClick"]>) => Promise<any>;
  as?: TAs;
  replace?: boolean;
  disabled?: boolean;
};

export function LButton<TAs extends ComponentType<any> | "button" = typeof Button>(props: LButtonProps<TAs>) {
  const { onClick, children, replace, disabled, ...restProps } = props;
  const As = props.as ?? Button;
  const css = useStyles(props);
  const validRef = useRef<boolean>(true);
  const [pending, setPending] = useState<boolean>(false);
  const handleClick = useMemo<AsProps<TAs>["onClick"]>(
    () => (...args: Parameters<AsProps<TAs>["onClick"]>) => {
      setPending(true);
      return onClick(...args)
        .then((result) => {
          validRef.current && setPending(false);
          return result;
        })
        .catch((err) => {
          validRef.current && setPending(false);
          // throw err;
        });
    },
    [onClick, setPending]
  );
  useEffect(() => {
    validRef.current = true;
    return function unmount() {
      validRef.current = false;
    };
  });
  return (
    <As {...restProps} onClick={handleClick} disabled={pending || disabled}>
      {pending && <CircularProgress size={20} className={css.circle} />}
      {(!replace || !pending) && children}
    </As>
  );
}
