import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  fade,
  Hidden,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, Cancel, CancelOutlined, Check, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment, useCallback, useState } from "react";
import { GetAssessmentResult } from "../../api/type";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";
import { LButton, LButtonProps } from "../../components/LButton";

const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});

const createOutlinedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  borderColor: paletteColor.light,
  "&:hover": {
    borderColor: paletteColor.main,
    backgroundColor: fade(paletteColor.main, palette.action.hoverOpacity),
  },
});

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  arrowBack: {
    color: palette.common.black,
    marginRight: 28,
    [breakpoints.down("sm")]: {
      marginRight: 16,
    },
  },
  kidsloopLogo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  title: {
    marginRight: "auto",
    [breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  headerButton: {
    fontWeight: "bold",
    borderRadius: 27,
    marginLeft: 50,
  },
  iconButton: {
    marginRight: 16,
    padding: 5,
    border: "thin solid currentColor",
  },
  redButton: createContainedColor(palette.error, palette),
  redOutlinedButton: createOutlinedColor(palette.error, palette),
  greenButton: createContainedColor(palette.success, palette),
  primaryIconButton: createContainedColor(palette.primary, palette),
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
    marginTop: 16,
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
    [breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },
}));

interface AssessmentHeaderProps {
  name: string;
  onBack: ButtonProps["onClick"];
  onSave: LButtonProps["onClick"];
  onComplete: Function;
  assessmentDetail: GetAssessmentResult;
}
export function AssessmentHeader(props: AssessmentHeaderProps) {
  const { name, onComplete, onSave, onBack, assessmentDetail } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleOk = useCallback(() => {
    setOpen(false);
    onComplete();
  }, [onComplete]);
  return (
    <Fragment>
      <Box display="flex" alignItems="center" pl={sm ? 2 : 3} pr={10} height={72} boxShadow={3}>
        <IconButton size="small" className={css.arrowBack} onClick={onBack}>
          <ArrowBack fontSize={sm ? "small" : "default"} />
        </IconButton>
        <Hidden smDown>
          <img className={css.kidsloopLogo} src={KidsloopLogo} alt="kidsloop logo" />
        </Hidden>
        <Typography variant="h6" className={css.title}>
          {sm ? name : "For Organizations"}
        </Typography>
        <Hidden smDown>
          <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={onBack}>
            Cancel
          </Button>
          {assessmentDetail.status === "in_progress" && (
            <LButton variant="contained" endIcon={<Save />} color="primary" className={css.headerButton} onClick={onSave}>
              Save
            </LButton>
          )}
          {assessmentDetail.status === "in_progress" && (
            <Button variant="contained" endIcon={<Check />} className={clsx(css.headerButton, css.greenButton)} onClick={handleOpen as any}>
              Compelete
            </Button>
          )}
        </Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {name}
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" py={2}>
          <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onBack}>
            <CancelOutlined fontSize="small" />
          </IconButton>
          {assessmentDetail.status === "in_progress" && (
            <LButton as={IconButton} className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={onSave} replace>
              <Save fontSize="small" />
            </LButton>
          )}
          {assessmentDetail.status === "in_progress" && (
            <IconButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={handleOpen as any}>
              <Check fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Hidden>
      <Dialog open={open} onClose={handleCancel}>
        <DialogContent dividers>You cannot change the assessment after clicking Complete.</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
