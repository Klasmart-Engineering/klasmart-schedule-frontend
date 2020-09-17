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
import { Content } from "../../api/api";
import { apiResourcePathById, MockOptionsItem } from "../../api/extra";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField } from "../../components/FormattedTextField";
import { SingleUploader } from "../../components/SingleUploader";
import { ContentDetailForm, formattedTime } from "../../models/ModelContentDetailForm";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  fieldset: {
    marginTop: 32,
  },
  fieldsetReject: {
    color: palette.error.main,
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
  contentDetail: Content;
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
      <Box component="form" p="7.8% 8.5%">
        {contentDetail.publish_status === "rejected" && (
          <FormControl variant="outlined">
            <InputLabel error variant="outlined" htmlFor="rejectReason">
              Reject Reason
            </InputLabel>
            <OutlinedInput
              readOnly
              className={css.fieldsetReject}
              error
              id="rejectReason"
              value={contentDetail.reject_reason}
              label="Reject Reason"
            ></OutlinedInput>
          </FormControl>
        )}
        <Controller
          as={TextField}
          control={control}
          className={css.fieldset}
          name="name"
          label={lesson === "material" ? "Material Name" : "Plan Name"}
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
            <SingleUploader
              partition="thumbnail"
              accept="image/*"
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
                    Thumbnail
                  </Button>
                  {isUploading && <ProgressWithText value={item?.completed} />}
                  {!isUploading && value && <img className={css.thumbnailImg} alt="thumbnail" src={apiResourcePathById(value)} />}
                </Box>
              )}
            />
          )}
        />
        {contentDetail.id && (
          <Box>
            <Controller
              as={TextField}
              name="created_at"
              defaultValue={formattedTime(contentDetail.created_at)}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label="Created on"
            ></Controller>
            <Controller
              as={TextField}
              name="author_name"
              defaultValue={contentDetail.author_name}
              control={control}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label="Author"
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
          label="Suggested Duration (min)"
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
              label="Program"
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
          label="Subject"
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
                label="Developmental"
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
            label="Skills"
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
            label="Age"
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
            label="Grade"
          >
            {menuItemList(flattenedMockOptions.grade)}
          </Controller>
        </Box>
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label="Visibility Settings"
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
          label="Description"
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          decode={decodeArray}
          defaultValue={contentDetail.keywords}
          className={css.fieldset}
          label="Keywords"
          helperText=""
        />
      </Box>
    </ThemeProvider>
  );
}
