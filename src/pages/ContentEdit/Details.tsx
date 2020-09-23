import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  createMuiTheme,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById, MockOptionsItem } from "../../api/extra";
import { CropImage } from "../../components/CropImage";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../../components/FormattedTextField";
import { SingleUploader } from "../../components/SingleUploader";
import { d } from "../../locale/LocaleManager";
import { ContentDetailForm, formattedTime } from "../../models/ModelContentDetailForm";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  details: {
    minHeight: 800,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  fieldset: {
    marginTop: 32,
  },
  fieldsetReject: {
    color: palette.error.main,
    marginBottom: 32,
  },
  halfFieldset: {
    marginTop: 32,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  thumbnailImg: {
    width: 260,
    height: 132,
  },
  thumbnailButton: {
    height: 56,
    marginRight: "auto",
  },
  thumbnailProgressText: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function ProgressWithText(props: CircularProgressProps) {
  const css = useStyles();
  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <CircularProgress className={css.thumbnailImg} variant="static" {...props} />
      <Box className={css.thumbnailProgressText}>
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value || 0)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
interface DetailsProps {
  contentDetail: EntityContentInfoWithDetails;
  uploadThumnail?: Function;
  formMethods: UseFormMethods<ContentDetailForm>;
  flattenedMockOptions: FlattenedMockOptions;
  onChangeProgram: (value: NonNullable<ContentDetailForm["program"]>) => any;
  onChangeDevelopmental: (value: NonNullable<ContentDetailForm["developmental"]>) => any;
}

export default function Details(props: DetailsProps) {
  const {
    contentDetail,
    formMethods: { control, errors },
    flattenedMockOptions,
    onChangeDevelopmental,
    onChangeProgram,
  } = props;

  const css = useStyles();
  const { lesson } = useParams();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));

  const menuItemList = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));
  const size = sm ? "small" : "medium";
  const theme = createMuiTheme(defaultTheme, {
    props: {
      MuiTextField: {
        size,
        fullWidth: true,
      },
      MuiFormControl: {
        size,
        fullWidth: true,
      },
      MuiButton: {
        size,
      },
      MuiSvgIcon: {
        fontSize: sm ? "small" : "default",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Box component="form" p="7.8% 8.5%" className={css.details}>
        {contentDetail.publish_status === "rejected" && (
          <FormControl variant="outlined">
            <InputLabel error variant="outlined" htmlFor="rejectReason">
              {d("Reason").t("library_label_reason")}
            </InputLabel>
            <OutlinedInput
              readOnly
              className={css.fieldsetReject}
              error
              id="rejectReason"
              multiline
              value={contentDetail.reject_reason}
              label={d("Reason").t("library_label_reason")}
            ></OutlinedInput>
          </FormControl>
        )}
        <Controller
          as={TextField}
          control={control}
          // className={css.fieldset}
          name="name"
          label={lesson === "material" ? d("Material Name").t("library_label_material_name") : d("Plan Name").t("library_label_plan_name")}
          required
          defaultValue={contentDetail.name}
          rules={{ required: true }}
          error={errors.name ? true : false}
          helperText=""
        />
        <Controller
          name="thumbnail"
          defaultValue={contentDetail.thumbnail}
          control={control}
          render={(props) => (
            <CropImage
              render={({ crop }) => (
                <SingleUploader
                  partition="thumbnail"
                  accept="image/*"
                  transformFile={crop}
                  {...props}
                  render={({ uploady, item, btnRef, value, isUploading }) => (
                    <Box className={css.fieldset} display="flex">
                      <Button
                        className={css.thumbnailButton}
                        ref={btnRef}
                        size={sm ? "medium" : "large"}
                        variant="contained"
                        component="span"
                        color="primary"
                        endIcon={<CloudUploadOutlined />}
                      >
                        {d("Thumbnail").t("library_label_thumbnail")}
                      </Button>
                      {isUploading && <ProgressWithText value={item?.completed} />}
                      {!isUploading && value && <img className={css.thumbnailImg} alt="thumbnail" src={apiResourcePathById(value)} />}
                    </Box>
                  )}
                />
              )}
            />
          )}
        />
        {contentDetail.id && (
          <Box>
            <Controller
              as={TextField}
              name="created_at"
              defaultValue={formattedTime(contentDetail.updated_at)}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Created On").t("library_label_created_on")}
            ></Controller>
            <Controller
              as={TextField}
              name="author_name"
              defaultValue={contentDetail.author_name}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Author").t("library_label_author")}
            ></Controller>
          </Box>
        )}
        <Controller
          as={FormattedTextField}
          control={control}
          name="suggest_time"
          decode={Number}
          type="number"
          className={css.fieldset}
          label={d("Duration(Minutes)").t("library_label_duration")}
          defaultValue={contentDetail.suggest_time}
        />
        <Controller
          name="program"
          defaultValue={contentDetail.program}
          control={control}
          render={(props) => (
            <FormattedTextField
              select
              className={css.fieldset}
              label={d("Program").t("library_label_program")}
              encode={encodeOneItemArray}
              decode={decodeOneItemArray}
              {...props}
              onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                onChangeProgram(value);
                props.onChange(value);
              }}
              required
            >
              {menuItemList(flattenedMockOptions.program)}
            </FormattedTextField>
          )}
        />
        <Controller
          as={TextField}
          select
          SelectProps={{ multiple: true }}
          className={css.fieldset}
          label={d("Subject").t("library_label_subject")}
          name="subject"
          defaultValue={contentDetail.subject}
          control={control}
        >
          {menuItemList(flattenedMockOptions.subject)}
        </Controller>
        <Box>
          <Controller
            name="developmental"
            defaultValue={contentDetail.developmental}
            control={control}
            render={(props) => (
              <FormattedTextField
                select
                className={sm ? css.fieldset : css.halfFieldset}
                label={d("Category").t("library_label_category")}
                encode={encodeOneItemArray}
                decode={decodeOneItemArray}
                {...props}
                onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                  onChangeDevelopmental(value);
                  props.onChange(value);
                }}
                fullWidth={sm}
                required
              >
                {menuItemList(flattenedMockOptions.developmental)}
              </FormattedTextField>
            )}
          />

          <Controller
            as={TextField}
            name="skills"
            defaultValue={contentDetail.skills}
            control={control}
            select
            SelectProps={{ multiple: true }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Subcategory").t("library_label_subcategory")}
          >
            {menuItemList(flattenedMockOptions.skills)}
          </Controller>
        </Box>
        <Box>
          <Controller
            as={TextField}
            name="age"
            defaultValue={contentDetail.age}
            control={control}
            select
            SelectProps={{ multiple: true }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Age").t("library_label_age")}
          >
            {menuItemList(flattenedMockOptions.age)}
          </Controller>
          <Controller
            as={TextField}
            name="grade"
            defaultValue={contentDetail.grade}
            control={control}
            select
            SelectProps={{ multiple: true }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Grade").t("library_label_grade")}
          >
            {menuItemList(flattenedMockOptions.grade)}
          </Controller>
        </Box>
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label={d("Visibility Settings").t("library_label_visibility_settings")}
          name="publish_scope"
          required
          defaultValue={contentDetail.publish_scope}
          control={control}
          rules={{ required: true }}
          error={errors.publish_scope ? true : false}
          helperText=""
        >
          {menuItemList(flattenedMockOptions.visibility_settings)}
        </Controller>
        <Controller
          as={TextField}
          control={control}
          name="description"
          multiline
          defaultValue={contentDetail.description}
          className={css.fieldset}
          label={d("Description").t("library_label_description")}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          decode={decodeArray}
          defaultValue={contentDetail.keywords}
          className={css.fieldset}
          label={d("Keywords").t("library_label_keywords")}
          helperText=""
        />
      </Box>
    </ThemeProvider>
  );
}
