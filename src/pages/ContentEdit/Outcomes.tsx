import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Empty, Comingsoon } from "./MediaAssets";

const useStyles = makeStyles(({ breakpoints }) => ({
  mediaAssets: {
    minHeight: 722,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
}));
interface OutcomesProps {
  comingsoon?: boolean;
}

export default function Outcomes(props: OutcomesProps) {
  const css = useStyles();
  const { comingsoon } = props;
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon ? <Comingsoon /> : "outcomes"}
    </Box>
  );
}
