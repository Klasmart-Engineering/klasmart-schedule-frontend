import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { OutcomesProps } from "../../pages/ContentEdit/Outcomes";

const useStyles = makeStyles(({ palette }) => ({
  addOutcomesButton: {
    width: "90%",
    height: 54,
    backgroundColor: palette.primary.main,
    borderRadius: 6,
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
    padding: "5px 30px",
    display: "flex",
    marginLeft: 24,
    marginRight: 24,
    boxSizing: "border-box",
    position: "absolute",
    bottom: 20,
  },
  addText: {
    color: palette.common.white,
  },
}));
interface OutcomesInputProps {
  outcomesList: OutcomesProps[];
}
export const OutComesInput = (props: OutcomesInputProps) => {
  const css = useStyles();

  return (
    <Box color="primary" className={css.addOutcomesButton}>
      <Typography component="h6" className={css.addText}>
        Added Learning Outcomes
      </Typography>
    </Box>
  );
};
