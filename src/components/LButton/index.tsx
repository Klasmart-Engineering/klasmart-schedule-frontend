import { Button, ButtonProps, CircularProgress } from "@material-ui/core";
import React, { useMemo, useState } from "react";

interface LButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: <T>(...args: Parameters<Required<ButtonProps>["onClick"]>) => Promise<T>;
}
export function LButton(props: LButtonProps) {
  const { onClick, children, ...restProps } = props;
  const [pending, setPending] = useState<boolean>(false);
  const handleClick = useMemo<Required<ButtonProps>["onClick"]>(
    () => (...args) => {
      setPending(true);
      return onClick(...args)
        .then((result) => {
          setPending(false);
          return result;
        })
        .catch((err) => {
          setPending(false);
          throw err;
        });
    },
    [onClick, setPending]
  );
  return (
    <Button {...restProps} onClick={handleClick} disabled={pending}>
      {children}
      {pending && <CircularProgress size={20} />}
    </Button>
  );
}
