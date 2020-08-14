import React, { Fragment } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  Typography,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  fade,
  useTheme,
  useMediaQuery,
  Hidden,
} from "@material-ui/core";
import { ArrowBack, PlayCircleOutline, Cancel, Save, Publish, RemoveCircleOutline, CancelOutlined } from "@material-ui/icons";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";
import clsx from "clsx";
import { PaletteColor, Palette } from "@material-ui/core/styles/createPalette";
import { connect } from "react-redux";

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

interface HeaderProps {
  lesson: string;
  onChangeLesson: (lesson: string) => any;
  topicList: [];
}
const mapStateToProps = (state: any) => {
  return {
    topicList: state.content.topicList,
  };
};

function ContentHeader(props: HeaderProps) {
  const { lesson, onChangeLesson, topicList } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  const radioTypography = sm ? "subtitle2" : "h5";
  const stateSubmit = (type: string) => {
    console.log(topicList);
  };
  return (
    <Fragment>
      <Box display="flex" alignItems="center" pl={sm ? 2 : 3} pr={10} height={72} boxShadow={3}>
        <IconButton size="small" className={css.arrowBack}>
          <ArrowBack fontSize={sm ? "small" : "default"} />
        </IconButton>
        <Hidden smDown>
          <img className={css.kidsloopLogo} src={KidsloopLogo} alt="kidsloop logo" />
        </Hidden>
        <Typography variant="h6" className={css.title}>
          {sm ? "Create New Content" : "For Organizations"}
        </Typography>
        <Hidden smDown>
          <Button
            variant="outlined"
            endIcon={<PlayCircleOutline />}
            color="primary"
            className={css.headerButton}
            onClick={() => {
              stateSubmit("preview");
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            endIcon={<Cancel />}
            className={clsx(css.headerButton, css.redButton)}
            onClick={() => {
              stateSubmit("cancel");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            endIcon={<Save />}
            color="primary"
            className={css.headerButton}
            onClick={() => {
              stateSubmit("save");
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            endIcon={<Publish />}
            className={clsx(css.headerButton, css.greenButton)}
            onClick={() => {
              stateSubmit("publish");
            }}
          >
            Publish
          </Button>
        </Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            Create New Content
          </Typography>
          <Button variant="outlined" startIcon={<RemoveCircleOutline />} className={clsx(css.headerButton, css.redOutlinedButton)}>
            Remove to Archive
          </Button>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" pt={3}>
          <IconButton className={clsx(css.iconButton, css.redOutlinedButton)} color="primary">
            <RemoveCircleOutline fontSize="small" />
          </IconButton>
          <IconButton className={css.iconButton} color="primary">
            <PlayCircleOutline fontSize="small" />
          </IconButton>
          <IconButton className={clsx(css.iconButton, css.redButton)} color="primary">
            <CancelOutlined fontSize="small" />
          </IconButton>
          <IconButton className={clsx(css.iconButton, css.primaryIconButton)} color="primary">
            <Save fontSize="small" />
          </IconButton>
          <IconButton className={clsx(css.iconButton, css.greenButton)} color="primary">
            <Publish fontSize="small" />
          </IconButton>
        </Box>
      </Hidden>
      <Box display="flex" justifyContent="center">
        <RadioGroup
          className={css.radioGroup}
          value={lesson}
          onChange={(e) => {
            onChangeLesson(e.target.value);
          }}
        >
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio size={size} color="primary" value="assets" />}
            label={<Typography variant={radioTypography}>Assets</Typography>}
          />
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio size={size} color="primary" value="material" />}
            label={<Typography variant={radioTypography}>Lesson Material</Typography>}
          />
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio size={size} color="primary" value="plan" />}
            label={<Typography variant={radioTypography}>Lesson Plan</Typography>}
          />
        </RadioGroup>
      </Box>
    </Fragment>
  );
}

export default connect(mapStateToProps)(ContentHeader);
