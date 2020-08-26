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
}));

interface DetailsProps {
  contentDetail?: Content;
  uploadThumnail?: Function;
  formMethods: UseFormMethods<CreateContentRequest>;
}
export default function Details(props: DetailsProps) {
  const {
    contentDetail,
    formMethods: { register, control, errors },
  } = props;
  const css = useStyles();
  const { lesson } = useParams();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
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
        {contentDetail.publish_status === "regected" && (
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
          defaultValue={contentDetail.name}
        ></Controller>
        <Box className={css.fieldset}>
          <input id="thumbnail-file-input" type="file" accept="image/*" hidden></input>
          <label htmlFor="thumbnail-file-input">
            <Button size={sm ? "medium" : "large"} variant="contained" component="span" color="primary" endIcon={<CloudUploadOutlined />}>
              Thumbnail
            </Button>
          </label>
        </Box>
        <Controller
          as={TextField}
          control={control}
          name="suggest_time"
          className={css.fieldset}
          label="Suggested Duration (min)"
          defaultValue={contentDetail.name}
        ></Controller>
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
          <MenuItem value="program1">program one</MenuItem>
          <MenuItem value="program2">program two</MenuItem>
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
          <MenuItem value="subject1">subject1</MenuItem>
          <MenuItem value="subject2">subject2</MenuItem>
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
            <MenuItem value="developmental1">developmental1</MenuItem>
            <MenuItem value="developmental2">developmental2</MenuItem>
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
            <MenuItem value="skills1">skills1</MenuItem>
            <MenuItem value="skills2">skills2</MenuItem>
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
            <MenuItem value="age1">age1</MenuItem>
            <MenuItem value="age2">age2</MenuItem>
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
            <MenuItem value="grade1">grade1</MenuItem>
            <MenuItem value="grade2">grade2</MenuItem>
          </Controller>
        </Box>
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label="Visibility Settings"
          name="publish_scope"
          defaultValue={contentDetail.publish_scope}
          control={control}
        >
          <MenuItem value="publish_scope1">publish_scope1</MenuItem>
          <MenuItem value="publish_scope2">publish_scope2</MenuItem>
        </Controller>
        <Controller
          as={TextField}
          control={control}
          name="description"
          defaultValue={contentDetail.description}
          className={css.fieldset}
          label="Description"
        ></Controller>
        <Controller
          as={TextField}
          control={control}
          name="keywords"
          defaultValue={contentDetail.keywords}
          className={css.fieldset}
          label="Keywords"
        ></Controller>
      </Box>
    </ThemeProvider>
  );
}
