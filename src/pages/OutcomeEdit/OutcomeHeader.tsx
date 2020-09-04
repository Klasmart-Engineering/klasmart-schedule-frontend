import { Box, Button, fade, Hidden, IconButton, makeStyles, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, Cancel, CancelOutlined, Check, Clear, Delete, Publish, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";

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
  deleteButton: {
    border: "1px solid red",
    borderRadius: "28px",
    color: "red",
    fontWeight: 700,
  },
}));

interface OutcomeHeaderProps {
  handleSave: () => void;
  handleReset: () => void;
  handleDelete: () => void;
  outcome_id: string;
  handelReject: () => void;
}

function OutcomeHeader(props: OutcomeHeaderProps) {
  const history = useHistory();
  const css = useStyles();
  const { handleSave, handleReset, handleDelete, outcome_id, handelReject } = props;
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  // const size = sm ? "small" : "medium";
  // const radioTypography = sm ? "subtitle2" : "h5";
  const handleClick = () => {};
  const goBack = () => {
    history.go(-1);
  };
  return (
    <Fragment>
      <Box display="flex" alignItems="center" pl={sm ? 2 : 3} pr={10} height={72} boxShadow={3}>
        <Button size="small" className={css.arrowBack} onClick={goBack}>
          <ArrowBack fontSize={sm ? "small" : "default"} />
        </Button>
        <Hidden smDown>
          <img className={css.kidsloopLogo} src={KidsloopLogo} alt="kidsloop logo" />
        </Hidden>
        <Typography variant="h6" className={css.title}>
          {sm ? "Create New Content" : "For Organizations"}
        </Typography>
        <Hidden smDown>
          <Button variant="outlined" endIcon={<Delete />} className={clsx(css.deleteButton)} onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={handleReset}>
            Cancel
          </Button>
          <Button variant="contained" endIcon={<Save />} color="primary" className={css.headerButton} onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" endIcon={<Publish />} className={clsx(css.headerButton, css.greenButton)} onClick={handleClick}>
            Publish
          </Button>
          <Button variant="contained" endIcon={<Clear />} className={clsx(css.headerButton, css.redButton)} onClick={handelReject}>
            Reject
          </Button>
          <Button variant="contained" endIcon={<Check />} className={clsx(css.headerButton, css.greenButton)} onClick={handleClick}>
            Approve
          </Button>
        </Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {outcome_id ? "Details" : "Create a New Learning Outcome"}
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" pt={3}>
          <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={handleReset}>
            <CancelOutlined fontSize="small" />
          </IconButton>
          <Button className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={handleSave}>
            <Save fontSize="small" />
          </Button>
          <Button className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={handleClick}>
            <Publish fontSize="small" />
          </Button>
        </Box>
      </Hidden>
    </Fragment>
  );
}

export default OutcomeHeader;
