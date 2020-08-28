import {
  Box,
  Button,
  createMuiTheme,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  TextField,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Content, CreateContentRequest } from "../../api/api";
import { MockOptions, MockOptionsItem } from "../../api/extra";
import { decodeArray, FormattedTextField } from "../../components/FormattedTextField";
import { SingleUploader } from "../../components/SingleUploader";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  fieldset: {
    marginTop: 20,
  },
  fieldsetReject: {
    color: palette.error.main,
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  asterisk: {
    color: palette.error.main,
  },
}));
interface DetailsProps {
  contentDetail?: Content;
  uploadThumnail?: Function;
  formMethods: UseFormMethods<CreateContentRequest>;
  mockOptions: MockOptions;
}

export default function Details(props: DetailsProps) {
  const {
    contentDetail,
    formMethods: { register, control, errors, watch, getValues },
    mockOptions,
  } = props;

  watch();
  console.log("values = ", getValues());

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
  useEffect(() => {
    register("thumbnail");
  });
  if (!contentDetail) return null;
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
        />
        <SingleUploader
          render={({ uploady, item, btnRef }) => (
            <Box className={css.fieldset}>
              <Button
                ref={btnRef}
                size={sm ? "medium" : "large"}
                variant="contained"
                component="span"
                color="primary"
                endIcon={<CloudUploadOutlined />}
              >
                Thumbnail
              </Button>
            </Box>
          )}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="suggest_time"
          decode={Number}
          className={css.fieldset}
          label="Suggested Duration (min)"
          defaultValue={contentDetail.suggest_time}
        />
        <Controller
          as={TextField}
          select
          SelectProps={{ multiple: true }}
          className={css.fieldset}
          label="Program"
          name="program"
          defaultValue={contentDetail.program}
          control={control}
        >
          {menuItemList(mockOptions.program)}
        </Controller>
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
          {menuItemList(mockOptions.subject)}
        </Controller>
        <Box>
          <Controller
            as={TextField}
            name="developmental"
            defaultValue={contentDetail.developmental}
            control={control}
            select
            SelectProps={{ multiple: true }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Developmental"
          >
            {menuItemList(mockOptions.developmental)}
          </Controller>
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
            {menuItemList(mockOptions.skills)}
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
            {menuItemList(mockOptions.age)}
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
            {menuItemList(mockOptions.grade)}
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
        >
          {menuItemList(mockOptions.visibility_settings)}
        </Controller>
        <Controller
          as={TextField}
          control={control}
          name="description"
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
        />
      </Box>
    </ThemeProvider>
  );
}
