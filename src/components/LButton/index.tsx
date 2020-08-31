import { Button, ButtonProps, CircularProgress, makeStyles } from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";

const useStyles = makeStyles({
  circle: {
    marginRight: 8,
  },
});

interface LButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick: <T>(...args: Parameters<Required<ButtonProps>["onClick"]>) => Promise<T>;
}
export function LButton(props: LButtonProps) {
  const { onClick, children, ...restProps } = props;
  const css = useStyles();
  const validRef = useRef<boolean>(true);
  const [pending, setPending] = useState<boolean>(false);
  const handleClick = useMemo<Required<ButtonProps>["onClick"]>(
    () => (...args) => {
      setPending(true);
      return onClick(...args)
        .then((result) => {
          validRef.current && setPending(false);
          return result;
        })
        .catch((err) => {
          validRef.current && setPending(false);
          throw err;
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
    <Button {...restProps} onClick={handleClick} disabled={pending}>
      {pending && <CircularProgress size={20} className={css.circle} />}
      {children}
    </Button>
  );
}
