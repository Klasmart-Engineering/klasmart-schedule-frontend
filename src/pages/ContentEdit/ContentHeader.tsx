import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import React, { forwardRef, Fragment, useReducer } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ContentInputSourceType } from "../../api/type";
import KidsloopLogo from "../../assets/icons/kidsloop-logo.svg";
import { LButton, LButtonProps } from "../../components/LButton";
import { Permission, PermissionType, usePermission } from "../../components/Permission";
import { d } from "../../locale/LocaleManager";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";

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
  radioGroup: {
    flexDirection: "row",
    padding: "7px 0",
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
    [breakpoints.down("sm")]: {
      boxShadow: "none",
      width: "95%",
    },
  },
  selectLessonItem: {
    fontSize: 18,
  },
  dialogContentRemoveborder: {
    borderBottom: "none",
  },
  h5pRadio: {
    fontWeight: 700,
  },
}));
interface HeaderProps {
  lesson: string;
  onChangeLesson: (lesson: string) => any;
  contentDetail?: EntityContentInfoWithDetails;
  formMethods: UseFormMethods<ContentDetailForm>;
  onCancel: ButtonProps["onClick"];
  onSave: LButtonProps["onClick"];
  onPublish: () => any;
  onBack: ButtonProps["onClick"];
  onDelete: ButtonProps["onClick"];
  id: string | null;
  inputSourceWatch: ContentInputSourceType;
}
export function ContentHeader(props: HeaderProps) {
  const { lesson, onChangeLesson, contentDetail, formMethods, onCancel, onPublish, onSave, onBack, onDelete, id, inputSourceWatch } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const {
    control,
    formState: { isDirty },
  } = formMethods;
  const isShowToggle = inputSourceWatch === ContentInputSourceType.fromFile;
  const sm = useMediaQuery(breakpoints.down("sm"));
  const xs = useMediaQuery(breakpoints.down("xs"));
  const size = sm ? "small" : "medium";
  const radioTypography = sm ? (xs ? "caption" : "subtitle2") : "h6";
  const [open, toggle] = useReducer((open) => {
    return !open;
  }, false); // const handleOk = useCallback(async() => {
  //   toggle();
  //   onPublish();
  // }, [onPublish]);

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
          {!(lesson === "assets" && id) &&
            (isShowToggle ? (
              <LButton
                variant="contained"
                endIcon={<Publish />}
                className={clsx(css.headerButton, css.greenButton)}
                onClick={async () => toggle()}
                disabled={!(contentDetail?.publish_status === "draft" && !isDirty)}
              >
                {d("Publish").t("library_label_publish")}
              </LButton>
            ) : (
              <LButton
                variant="contained"
                endIcon={<Publish />}
                className={clsx(css.headerButton, css.greenButton)}
                onClick={onPublish as any}
                disabled={!(contentDetail?.publish_status === "draft" && !isDirty) && lesson !== "assets"}
              >
                {d("Publish").t("library_label_publish")}
              </LButton>
            ))}
          {lesson === "assets" && id && (
            <Permission
              value={PermissionType.delete_asset_340}
              render={(value) =>
                value && (
                  <LButton
                    variant="outlined"
                    endIcon={<DeleteOutlineOutlined />}
                    color="primary"
                    className={clsx(css.headerButton, css.redOutlinedButton)}
                    onClick={onDelete as any}
                  >
                    {d("Delete").t("library_label_delete")}
                  </LButton>
                )
              }
            />
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
          {!(lesson === "assets" && id) &&
            (inputSourceWatch === ContentInputSourceType.fromFile ? (
              <IconButton
                className={clsx(css.iconButton, css.greenButton)}
                onClick={toggle}
                disabled={!(contentDetail?.publish_status === "draft" && !isDirty) && lesson !== "assets"}
              >
                <Publish fontSize="small" />
              </IconButton>
            ) : (
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
            ))}
          {lesson === "assets" && id && (
            <Permission
              value={PermissionType.delete_asset_340}
              render={(value) =>
                value && (
                  <LButton
                    as={IconButton}
                    className={clsx(css.iconButton, css.redOutlinedButton)}
                    color="primary"
                    onClick={onDelete as any}
                    replace
                  >
                    <DeleteOutlineOutlined fontSize="small" />
                  </LButton>
                )
              }
            />
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
      <Dialog open={open} onClose={toggle}>
        <DialogTitle className={css.dialogContentRemoveborder}>
          {d("How would you like to publish?").t("library_msg_publish_lesson_material")}
        </DialogTitle>
        <DialogContent dividers className={css.dialogContentRemoveborder}>
          <Controller name="publishType" as={SelectPublishType} lesson={lesson} control={control} defaultValue="onlyMaterialOrPlan" />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggle} color="primary">
            {d("Cancel").t("assess_label_cancel")}
          </Button>
          <Button
            onClick={() => {
              toggle();
              onPublish();
            }}
            color="primary"
          >
            {d("OK").t("assess_label_ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
interface SelectPublishTypeProps {
  value?: string;
  lesson: string;
  onChange?: (value: SelectPublishTypeProps["value"]) => any;
}
export function SelectPublishType(props: SelectPublishTypeProps) {
  const { onChange, lesson } = props;
  const value = props.value ?? "onlyMaterialOrPlan";
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const xs = useMediaQuery(breakpoints.down("xs"));
  const size = sm ? "small" : "medium";
  const radioTypography = xs ? "subtitle2" : "h6";
  return (
    <RadioGroup
      className={css.radioGroup}
      value={value}
      onChange={(e) => {
        onChange && onChange(e.target.value);
      }}
    >
      <FormControlLabel
        color="primary"
        control={<Radio size={size} color="primary" value="onlyMaterialOrPlan" />}
        label={
          <Typography variant={radioTypography}>
            {lesson === "material"
              ? d("Only publish a lesson material").t("library_msg_only_publish_lesson_material")
              : d("Only publish a Lesson plan").t("library_msg_only_publish_lesson_plan")}
          </Typography>
        }
      />
      <FormControlLabel
        color="primary"
        control={<Radio size={size} color="primary" value="assetslib" />}
        label={
          <Typography variant={radioTypography}>
            {lesson === "material"
              ? d("Publish a lesson material, and add to assets library").t("library_msg_publish_lesson_material_and_asset")
              : d("Publish a lesson plan, and add teacher manuals to assets library").t("library_msg_publish_lesson_plan_and asset")}
          </Typography>
        }
      />
    </RadioGroup>
  );
}
interface SelectLessonProps {
  lesson: string;
  onChangeLesson: (value: string) => any;
  disabled: boolean;
}
export function SelectLesson(props: SelectLessonProps) {
  const css = useStyles();
  const create_asset = usePermission(PermissionType.create_asset_320);
  const create_material = usePermission(PermissionType.create_lesson_material_220);
  const create_plan = usePermission(PermissionType.create_lesson_plan_221);
  const create_content = usePermission(PermissionType.create_content_page_201);
  const { lesson, onChangeLesson, disabled } = props;
  return (
    <Box mb={3} display="flex" justifyContent="center">
      <TextField
        fullWidth
        select
        className={css.selectLesson}
        disabled={disabled}
        value={lesson}
        onChange={(e) => onChangeLesson(e.target.value)}
        InputProps={{
          style: {
            fontSize: 20,
            fontWeight: 700,
          },
        }}
      >
        {(create_asset || create_content) && (
          <MenuItem value="assets" className={css.selectLessonItem}>
            {d("Assets").t("library_label_assets")}
          </MenuItem>
        )}

        {(create_material || create_content) && (
          <MenuItem value="material" className={css.selectLessonItem}>
            {d("Lesson Material").t("library_label_lesson_material")}
          </MenuItem>
        )}

        {(create_plan || create_content) && (
          <MenuItem value="plan" className={css.selectLessonItem}>
            {d("Lesson Plan").t("library_label_lesson_plan")}
          </MenuItem>
        )}
      </TextField>
    </Box>
  );
}
interface SelectH5PRadioProps {
  value?: number;
  onChange?: (value: SelectH5PRadioProps["value"]) => any;
  formMethods: UseFormMethods<ContentDetailForm>;
  disabled: boolean;
}
export const SelectH5PRadio = forwardRef<HTMLDivElement, SelectH5PRadioProps>((props, ref) => {
  const { value, onChange, formMethods, disabled } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  const xs = useMediaQuery(breakpoints.down("xs"));
  const size = xs ? "small" : "medium";
  const radioTypography = xs ? "subtitle2" : "h6";
  return (
    <Box
      display="flex"
      mb={3}
      justifyContent={sm ? "center" : "start"}
      {...{
        ref,
      }}
    >
      <RadioGroup
        className={css.radioGroup}
        value={value}
        onChange={(e) => {
          formMethods.setValue("data.source", "", {
            shouldDirty: true,
          });
          onChange && onChange(Number(e.target.value));
        }}
      >
        <FormControlLabel
          color="primary"
          control={<Radio size={size} color="primary" value={1} />}
          label={
            <Typography variant={radioTypography} className={css.h5pRadio}>
              {d("H5P").t("library_label_h5p")}
            </Typography>
          }
          disabled={disabled}
        />
        {value === 3 ? (
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio size={size} color="primary" value={3} />}
            label={
              <Typography variant={radioTypography} className={css.h5pRadio}>
                {d("Non H5P").t("library_label_non_h5p")}
              </Typography>
            }
            disabled={disabled}
          />
        ) : (
          <FormControlLabel
            className={css.radio}
            color="primary"
            control={<Radio size={size} color="primary" value={2} />}
            label={
              <Typography variant={radioTypography} className={css.h5pRadio}>
                {d("Non H5P").t("library_label_non_h5p")}
              </Typography>
            }
            disabled={disabled}
          />
        )}
      </RadioGroup>
    </Box>
  );
});
