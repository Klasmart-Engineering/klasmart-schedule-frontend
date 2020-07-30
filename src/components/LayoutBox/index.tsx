import React, { ReactNode } from 'react';
import { styled, Box, makeStyles } from '@material-ui/core';

interface LayoutBoxProps {
  mainBase: number;
  holderMin: number;
  holderBase: number;
  children: ReactNode;
}

const useStyles = makeStyles({
  holder: (props: LayoutBoxProps) => ({
    flexGrow: 1,
    flexShrink: 1.5,
    flexBasis: props.holderBase,
    minWidth: props.holderMin,
  }),
  main: (props: LayoutBoxProps) => ({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: props.mainBase,
  }),
});

export default function LayoutBox(props: LayoutBoxProps) {
  const css = useStyles(props);
  return (
    <Box display="flex">
      <Box className={css.holder} />
      <Box className={css.main}>{props.children}</Box>
      <Box className={css.holder} />
    </Box>
  );
};