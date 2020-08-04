import React, { Fragment } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  SvgIcon,
  Typography,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  fade,
} from "@material-ui/core";
import {
  ArrowBack,
  PlayCircleOutline,
  Cancel,
  Save,
  Publish,
  RemoveCircleOutline,
} from "@material-ui/icons";
import { ReactComponent as KidsloopLogo } from "../../assets/icons/kidsloop-logo.svg";
import clsx from "clsx";

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  arrowBack: {
    marginRight: 28,
  },
  kidsloopLogo: {
    fontSize: 40,
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
    textTransform: "none",
    borderRadius: 27,
    marginLeft: 50,
  },
  redButton: {
    color: "white",
    backgroundColor: palette.error.main,
    "&:hover": {
      backgroundColor: palette.error.dark,
    },
  },
  redOutlinedButton: {
    color: palette.error.main,
    borderColor: palette.error.light,
    "&:hover": {
      borderColor: palette.error.main,
      backgroundColor: fade(palette.error.main, palette.action.hoverOpacity),
    },
  },
  greenButton: {
    color: "white",
    backgroundColor: palette.success.main,
    "&:hover": {
      backgroundColor: palette.success.dark,
    },
  },
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
    marginTop: 16,
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
  },
}));

export default function Header() {
  const css = useStyles();
  return (
    <Fragment>
      <Box
        display="flex"
        alignItems="center"
        pl={3}
        pr={10}
        height={72}
        boxShadow={3}
      >
        <IconButton size="small" className={css.arrowBack}>
          <ArrowBack />
        </IconButton>
        <SvgIcon
          component={KidsloopLogo}
          className={css.kidsloopLogo}
          viewBox="0 0 49 42"
        />
        <Typography variant="h6" className={css.title}>
          For Organizations
        </Typography>
        <Button
          variant="outlined"
          endIcon={<PlayCircleOutline />}
          color="primary"
          className={css.headerButton}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          endIcon={<Cancel />}
          className={clsx(css.headerButton, css.redButton)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          endIcon={<Save />}
          color="primary"
          className={css.headerButton}
        >
          Save
        </Button>
        <Button
          variant="contained"
          endIcon={<Publish />}
          className={clsx(css.headerButton, css.greenButton)}
        >
          Publish
        </Button>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        pl={5}
        pr={10}
        height={64}
        boxShadow={2}
      >
        <Typography variant="h6" className={css.title}>
          Create New Content
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RemoveCircleOutline />}
          className={clsx(css.headerButton, css.redOutlinedButton)}
        >
          Remove to Archive
        </Button>
      </Box>
      <Box display="flex" justifyContent="center">
        <RadioGroup className={css.radioGroup} value={"material"}>
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio value="material" />}
            label={<Typography variant="h5">Lesson Material</Typography>}
          />
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio value="plan" />}
            label={<Typography variant="h5">Lesson Plan</Typography>}
          />
        </RadioGroup>
      </Box>
    </Fragment>
  );
}
