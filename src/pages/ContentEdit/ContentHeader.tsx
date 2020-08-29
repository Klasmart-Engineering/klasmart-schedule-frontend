import {
  Box,
  Button,
  fade,
  FormControlLabel,
  Hidden,
  IconButton,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { ArrowBack, Cancel, CancelOutlined, Publish, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment } from "react";
import { Content } from "../../api/api";
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
}));

interface HeaderProps {
  lesson: string;
  onChangeLesson: (lesson: string) => any;
  contentDetail?: Content;
  onCancel: Function;
  onSave: Function;
  onPublish: Function;
  isDirty: boolean;
}

function ContentHeader(props: HeaderProps) {
  const { lesson, onChangeLesson, contentDetail, onCancel, onPublish, onSave, isDirty } = props;
  console.log("isDirty=", isDirty);

  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  const radioTypography = sm ? "subtitle2" : "h5";
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
          <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={onCancel as any}>
            Cancel
          </Button>
          <Button variant="contained" endIcon={<Save />} color="primary" className={css.headerButton} onClick={onSave as any}>
            Save
          </Button>
          {contentDetail?.publish_status === "draft" && !isDirty && (
            <Button
              variant="contained"
              endIcon={<Publish />}
              className={clsx(css.headerButton, css.greenButton)}
              onClick={onPublish as any}
            >
              Publish
            </Button>
          )}
        </Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            Create New Content
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" pt={3}>
          <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onCancel as any}>
            <CancelOutlined fontSize="small" />
          </IconButton>
          <IconButton className={clsx(css.iconButton, css.primaryIconButton)} color="primary" onClick={onSave as any}>
            <Save fontSize="small" />
          </IconButton>
          {contentDetail?.publish_status === "draft" && !isDirty && (
            <IconButton className={clsx(css.iconButton, css.greenButton)} color="primary" onClick={onPublish as any}>
              <Publish fontSize="small" />
            </IconButton>
          )}
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

export default ContentHeader;
