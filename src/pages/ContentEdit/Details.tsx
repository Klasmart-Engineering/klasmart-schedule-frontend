import { Box, Button, createMuiTheme, makeStyles, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Content } from "../../api/api";
import { save } from "../../reducers/content";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  fieldset: {
    marginTop: 20,
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
  subscribeCancel: (listener: Function) => void;
  subscribeSave: (listener: Function) => void;
}
export default function Details(props: DetailsProps) {
  const { contentDetail, subscribeCancel, subscribeSave } = props;
  const css = useStyles();
  const defaultTheme = useTheme();
  const dispatch = useDispatch();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  const { register, handleSubmit, control, reset, errors, setValue } = useForm();
  console.log("errors = ", errors);
  const handleSave = useMemo(() => (form: Partial<Content>) => dispatch(save(form)), [dispatch]);
  useEffect(() => subscribeCancel(reset), [reset, subscribeCancel]);
  useEffect(() => {
    subscribeSave(handleSubmit(handleSave as any));
  }, [handleSubmit, subscribeSave, handleSave]);
  useEffect(() => {
    register("thumbnail");
    register("data");
  });
  if (!contentDetail) return null;
  const theme = createMuiTheme(defaultTheme, {
    props: {
      MuiTextField: {
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
        <Controller as={TextField} control={control} name="name" label="Material Name" defaultValue={contentDetail.name}></Controller>
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
