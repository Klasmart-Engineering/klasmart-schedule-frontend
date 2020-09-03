import { Box, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { Outcomes, OutcomesTable } from "../../pages/ContentEdit/Outcomes";

const useStyles = makeStyles(({ palette }) => ({
  outcomsInput: {
    position: "absolute",
    bottom: 20,
    width: "95%",
  },
  addOutcomesButton: {
    width: "100%",
    height: 54,
    backgroundColor: palette.primary.main,
    borderRadius: 6,
    padding: "5px 30px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: palette.action.disabledOpacity,
    },
  },
  addText: {
    color: palette.common.white,
  },
  indexUI: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.common.white,
    color: palette.primary.main,
    position: "absolute",
    right: 32,
  },
  closeButton: {
    position: "absolute",
    right: 14,
    top: 9,
    color: palette.grey[500],
  },
}));

interface OutcomesInputProps {
  selectedOutcomesList: Outcomes[];
}
export const OutComesInput = (props: OutcomesInputProps) => {
  const css = useStyles();
  const { selectedOutcomesList } = props;
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box className={css.outcomsInput}>
      <Box color="primary" className={css.addOutcomesButton} boxShadow={3} onClick={handleClickOpen}>
        <Typography component="h6" className={css.addText}>
          Added Learning Outcomes
        </Typography>
        <Box mr={2} className={css.indexUI}>
          <Typography variant="h6">{selectedOutcomesList.length}</Typography>
        </Box>
      </Box>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title">
          Added Learning Outcomes
          <IconButton aria-label="close" className={css.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <OutcomesTable list={selectedOutcomesList} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
