import {
  Box,
  Button,
  ButtonProps,
  fade,
  FormControlLabel,
  Hidden,
  IconButton,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import shadows from "@material-ui/core/styles/shadows";
import { ArrowBack, Cancel, CancelOutlined, DeleteOutlineOutlined, Publish, Save } from "@material-ui/icons";
import clsx from "clsx";
import React, { Fragment } from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
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
    // marginTop: 16,
  },
  radio: {
    "&:not(:first-child)": {
      marginLeft: 64,
    },
    [breakpoints.down("sm")]: {
      marginLeft: "0 !important",
      marginRight: 0,
    },
  },
  selectLesson: {
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
  },
  selectLessonItem: {
    fontSize: 18,
  },
}));

interface HeaderProps {
  lesson: string;
  onChangeLesson: (lesson: string) => any;
  contentDetail?: EntityContentInfoWithDetails;
  onCancel: ButtonProps["onClick"];
  onSave: LButtonProps["onClick"];
  onPublish: LButtonProps["onClick"];
  isDirty: boolean;
  onBack: ButtonProps["onClick"];
  onDelete: ButtonProps["onClick"];
  id: string | null;
}

export function ContentHeader(props: HeaderProps) {
  const { lesson, onChangeLesson, contentDetail, onCancel, onPublish, onSave, isDirty, onBack, onDelete, id } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const xs = useMediaQuery(breakpoints.down("xs"));
  const size = sm ? "small" : "medium";
  const radioTypography = sm ? (xs ? "caption" : "subtitle2") : "h6";
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
          {sm ? d("Create New Content").t("library_label_create_new_content") : d("For Organizations").t("library_label_for_organizations")}
        </Typography>
        <Hidden smDown>
          <Button variant="contained" endIcon={<Cancel />} className={clsx(css.headerButton, css.redButton)} onClick={onCancel}>
            {d("Cancel").t("library_label_cancel")}
          </Button>
          {lesson !== "assets" && (
            <LButton
              variant="contained"
              endIcon={<Save />}
              color="primary"
              className={css.headerButton}
              onClick={onSave}
              disabled={contentDetail?.publish_status === "draft" && !isDirty}
            >
              {d("Save").t("library_label_save")}
            </LButton>
          )}
          {!(lesson === "assets" && id) && (
            <LButton
              variant="contained"
              endIcon={<Publish />}
              className={clsx(css.headerButton, css.greenButton)}
              onClick={onPublish as any}
              disabled={!(contentDetail?.publish_status === "draft" && !isDirty) && lesson !== "assets"}
            >
              {d("Publish").t("library_label_publish")}
            </LButton>
          )}
          {lesson === "assets" && id && (
            <LButton
              variant="outlined"
              endIcon={<DeleteOutlineOutlined />}
              color="primary"
              className={clsx(css.headerButton, css.redOutlinedButton)}
              onClick={onDelete as any}
            >
              {d("Delete").t("library_label_delete")}
            </LButton>
          )}
        </Hidden>
      </Box>
      <Hidden smDown>
        <Box display="flex" alignItems="center" pl={5} pr={10} height={64} boxShadow={2}>
          <Typography variant="h6" className={css.title}>
            {d("Create New Content").t("library_label_create_new_content")}
          </Typography>
        </Box>
      </Hidden>
      <Hidden mdUp>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <IconButton className={clsx(css.iconButton, css.redButton)} color="primary" onClick={onCancel}>
            <CancelOutlined fontSize="small" />
          </IconButton>
          {lesson !== "assets" && (
            <LButton
              as={IconButton}
              className={clsx(css.iconButton, css.primaryIconButton)}
              color="primary"
              onClick={onSave}
              replace
              disabled={contentDetail?.publish_status === "draft" && !isDirty}
            >
              <Save fontSize="small" />
            </LButton>
          )}
          {!(lesson === "assets" && id) && (
            <LButton
              as={IconButton}
              className={clsx(css.iconButton, css.greenButton)}
              color="primary"
              onClick={onPublish}
              replace
              disabled={!(contentDetail?.publish_status === "draft" && !isDirty) && lesson !== "assets"}
            >
              <Publish fontSize="small" />
            </LButton>
          )}
          {lesson === "assets" && id && (
            <LButton
              as={IconButton}
              className={clsx(css.iconButton, css.redOutlinedButton)}
              color="primary"
              onClick={onDelete as any}
              replace
            >
              <DeleteOutlineOutlined fontSize="small" />
            </LButton>
          )}
        </Box>
      </Hidden>
      {false && (
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
              label={<Typography variant={radioTypography}>{d("Assets").t("library_label_assets")}</Typography>}
            />
            <FormControlLabel
              className={css.radio}
              color="primary"
              control={<Radio size={size} color="primary" value="material" />}
              label={<Typography variant={radioTypography}>{d("Lesson Material").t("library_label_lesson_material")}</Typography>}
            />
            <FormControlLabel
              className={css.radio}
              color="primary"
              control={<Radio size={size} color="primary" value="plan" />}
              label={<Typography variant={radioTypography}>{d("Lesson Plan").t("library_label_lesson_plan")}</Typography>}
            />
          </RadioGroup>
        </Box>
      )}
    </Fragment>
  );
}

interface SelectLessonProps {
  lesson: string;
  onChangeLesson: (value: string) => any;
}
export function SelectLesson(props: SelectLessonProps) {
  const css = useStyles();
  const { lesson, onChangeLesson } = props;
  return (
    <Box mb={4}>
      <TextField
        fullWidth
        select
        className={css.selectLesson}
        value={lesson}
        onChange={(e) => onChangeLesson(e.target.value)}
        InputProps={{ style: { fontSize: 18, fontWeight: 700 } }}
      >
        <MenuItem value="assets" className={css.selectLessonItem}>
          {d("Assets").t("library_label_assets")}
        </MenuItem>
        <MenuItem value="material" className={css.selectLessonItem}>
          {d("Lesson Material").t("library_label_lesson_material")}
        </MenuItem>
        <MenuItem value="plan" className={css.selectLessonItem}>
          {d("Lesson Plan").t("library_label_lesson_plan")}
        </MenuItem>
      </TextField>
    </Box>
  );
}

interface SelectH5PRadioProps {
  value: string;
  onChangeH5P: (value: string) => any;
}
export function SelectH5PRadio(props: SelectH5PRadioProps) {
  const { value, onChangeH5P } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  return (
    <Box display="flex" justifyContent={sm ? "center" : "start"}>
      <RadioGroup
        className={css.radioGroup}
        value={value}
        onChange={(e) => {
          onChangeH5P(e.target.value);
        }}
      >
        <FormControlLabel
          color="primary"
          control={<Radio size={size} color="primary" value="H5P" />}
          label={<Typography variant="h6">H5P</Typography>}
        />
        <FormControlLabel
          className={css.radio}
          color="primary"
          control={<Radio size={size} color="primary" value="NonH5P" />}
          label={<Typography variant="h6">Non H5P</Typography>}
        />
      </RadioGroup>
    </Box>
  );
}
