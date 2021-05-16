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
  useTheme
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, Cancel, CancelOutlined, Check, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment, useCallback, useReducer } from "react";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";

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
    width: 140,
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
  dialogContentRemoveborder: {
    borderBottom: "none",
  },
}));

interface AssessmentHeaderProps {
  name: string;
  onBack: ButtonProps["onClick"] | any;
  onSave: LButtonProps["onClick"];
  onComplete: Function;
  editable?: boolean;
}
export function DetailHeader(props: AssessmentHeaderProps) {
  const { name, onComplete, onSave, onBack, editable } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const [open, toggle] = useReducer((open) => {
    return !open;
  }, false);
  const [openCancel, toggleCancel] = useReducer((open) => {
    return !open;
  }, false);
  const handleOk = useCallback(() => {
    toggle();
    onComplete();
  }, [onComplete]);
  const handleDiscard = useCallback(() => {
    toggleCancel();
    onBack();
  }, [onBack]);
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
          {sm ? name : d("For Organizations").t("library_label_for_organizations")}
        </Typography>
        {editable && (
          <Hidden smDown>
            <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={toggleCancel}>
              {d("Cancel").t("assess_label_cancel")}
            </Button>
            <LButton variant="contained" endIcon={<Save />} color="primary" className={css.headerButton} onClick={onSave}>
              {d("Save").t("assess_label_save")}
            </LButton>
            <Button variant="contained" endIcon={<Check />} className={clsx(css.headerButton, css.greenButton)} onClick={toggle as any}>
              {d("Complete").t("assess_button_complete")}
            </Button>
          </Hidden>
        )}
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {name}
          </Typography>
        </Box>
      </Hidden>
      {editable && (
        <Hidden mdUp>
          <Box display="flex" justifyContent="flex-end" py={2}>
            <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={toggleCancel}>
              <CancelOutlined fontSize="small" />
            </IconButton>
            <LButton as={IconButton} className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={onSave} replace>
              <Save fontSize="small" />
            </LButton>
            <IconButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={toggle as any}>
              <Check fontSize="small" />
            </IconButton>
          </Box>
        </Hidden>
      )}
      <Dialog open={open} onClose={toggle}>
        <DialogContent dividers className={css.dialogContentRemoveborder}>
          {d("You cannot change the assessment after clicking Complete.").t("assess_msg_cannot_delete")}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button onClick={handleOk} color="primary">
            {d("OK").t("general_button_OK")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCancel} onClose={toggleCancel}>
        <DialogContent dividers className={css.dialogContentRemoveborder}>
          {d("Discard unsaved changes?").t("assess_msg_discard")}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggleCancel} color="primary">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button onClick={handleDiscard} color="primary">
            {d("DISCARD").t("general_button_DISCARD")}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
