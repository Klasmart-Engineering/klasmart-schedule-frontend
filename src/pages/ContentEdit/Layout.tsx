import { Box, makeStyles, BoxProps } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import React, { ReactNode, Children } from "react";
import clsx from "clsx";

const useStyles = makeStyles(({ breakpoints }) => ({
  layoutPair: (props: LayoutPairProps) => ({
    display: "flex",
    padding: props.padding,
    [breakpoints.down(props.breakpoint)]: {
      flexDirection: "column",
    },
    [breakpoints.down("sm")]: {
      padding: props.basePadding,
    },
  }),
  layoutLeft: (props: LayoutPairProps) => ({
    flexBasis: props.leftWidth,
    flexGrow: 1,
    flexShrink: 1,
    marginRight: props.spacing,
    [breakpoints.down(props.breakpoint)]: {
      marginRight: 0,
      marginBottom: 40,
      flexBasis: "100%",
    },
  }),
  layoutRight: (props: LayoutPairProps) => ({
    flexBasis: props.rightWidth,
    flexGrow: 1,
    flexShrink: 1,
    [breakpoints.down(props.breakpoint)]: {
      marginBottom: 40,
      flexBasis: "100%",
    },
  }),
}));

interface LayoutPairProps extends BoxProps {
  breakpoint: Breakpoint | number;
  spacing: string | number;
  leftWidth: string | number;
  rightWidth: string | number;
  basePadding: string | number;
  padding: string | number;
  children: ReactNode;
}
export default function LayoutPair(props: LayoutPairProps) {
  const {
    breakpoint,
    spacing,
    leftWidth,
    rightWidth,
    basePadding,
    padding,
    children,
    ...restProps
  } = props;
  const css = useStyles(props);
  let index = -1;
  const pairNodes = Children.map(props.children, (child) => {
    index += 1;
    return (
      <Box
        className={clsx({
          [css.layoutLeft]: index === 0,
          [css.layoutRight]: index === 1,
        })}
      >
        {child}
      </Box>
    );
  });
  return (
    <Box className={css.layoutPair} {...restProps}>
      {pairNodes}
    </Box>
  );
}
