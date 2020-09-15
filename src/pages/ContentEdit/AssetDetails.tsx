import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  createMuiTheme,
  makeStyles,
  MenuItem,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React from "react";
import { Controller, FieldError, UseFormMethods } from "react-hook-form";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import { SingleUploader } from "../../components/SingleUploader";
import { apiResourcePathById, MockOptions, MockOptionsItem } from "../../api/extra";
import { decodeArray, FormattedTextField } from "../../components/FormattedTextField";
import { Content } from "../../api/api";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  fieldset: {
    marginTop: 32,
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

function AssetsDetails(props: AssetDetailsProps) {
  const css = useStyles();
  const {
    formMethods: { control, errors },
    mockOptions,
    handleChangeFile,
    fileType,
    contentDetail,
  } = props;
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
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
  const menuItemList = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ));

  const handleTopicListChange = (event: React.ChangeEvent<{ value: String }>, name: string) => {
    handleChangeFile(event.target.value as "image" | "video" | "audio" | "document");
  };

  const errorValidator = (filed: (FieldError | undefined)[] | FieldError | undefined): boolean => {
    return filed ? true : false;
  };

  const isIdExist = (): boolean => {
    return contentDetail.id ? true : false;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box component="form" p="7.8% 8.5%">
        <TextField
          label="Lesson Material"
          required
          value={fileType}
          onChange={(e) => handleTopicListChange(e, "fileType")}
          disabled={isIdExist()}
          select
        >
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
          <MenuItem value="document">Document</MenuItem>
        </TextField>
        <Controller
          name="thumbnail"
          control={control}
          render={(props) => (
            <SingleUploader
              partition="thumbnail"
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
                    style={{ visibility: isIdExist() ? "hidden" : "visible" }}
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
        <Controller
          as={TextField}
          control={control}
          className={css.fieldset}
          name="name"
          label={"Assets Name"}
          required
          rules={{ required: true }}
          defaultValue={contentDetail.name}
          disabled={isIdExist()}
          error={errorValidator(errors.name)}
        />
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label="Program"
          name="program"
          control={control}
          SelectProps={{ multiple: true }}
          defaultValue={contentDetail.program}
          disabled={isIdExist()}
        >
          {menuItemList(mockOptions.program)}
        </Controller>
        <Controller
          as={TextField}
          select
          className={css.fieldset}
          label="Subject"
          name="subject"
          control={control}
          SelectProps={{ multiple: true }}
          defaultValue={contentDetail.subject}
          disabled={isIdExist()}
        >
          {menuItemList(mockOptions.subject)}
        </Controller>
        <Box>
          <Controller
            as={TextField}
            name="developmental"
            control={control}
            select
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Developmental"
            SelectProps={{ multiple: true }}
            required
            rules={{ required: true }}
            error={errorValidator(errors.developmental)}
            defaultValue={contentDetail.developmental}
            disabled={isIdExist()}
          >
            {menuItemList(mockOptions.developmental)}
          </Controller>
          <Controller
            as={TextField}
            name="skills"
            control={control}
            select
            required
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Skills"
            rules={{ required: true }}
            error={errorValidator(errors.skills)}
            SelectProps={{ multiple: true }}
            defaultValue={contentDetail.skills}
            disabled={isIdExist()}
          >
            {menuItemList(mockOptions.skills)}
          </Controller>
        </Box>
        <Box>
          <Controller
            as={TextField}
            name="age"
            control={control}
            select
            required
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Age"
            rules={{ required: true }}
            error={errorValidator(errors.age)}
            SelectProps={{ multiple: true }}
            defaultValue={contentDetail.age}
            disabled={isIdExist()}
          >
            {menuItemList(mockOptions.age)}
          </Controller>
          <Controller
            as={TextField}
            name="grade"
            control={control}
            select
            required
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label="Grade"
            rules={{ required: true }}
            error={errorValidator(errors.grade)}
            SelectProps={{ multiple: true }}
            defaultValue={contentDetail.grade}
            disabled={isIdExist()}
          >
            {menuItemList(mockOptions.grade)}
          </Controller>
        </Box>
        <Controller
          as={TextField}
          control={control}
          name="description"
          className={css.fieldset}
          label="Description"
          defaultValue={contentDetail.description}
          disabled={isIdExist()}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          decode={decodeArray}
          className={css.fieldset}
          label="Keywords"
          defaultValue={contentDetail.keywords}
          disabled={isIdExist()}
        />
      </Box>
    </ThemeProvider>
  );
}

interface AssetDetailsProps {
  formMethods: UseFormMethods<ContentDetailForm>;
  mockOptions: MockOptions;
  fileType: "image" | "video" | "audio" | "document";
  handleChangeFile: (type: "image" | "video" | "audio" | "document") => void;
  contentDetail: Content;
}

export default function AssetDetails(props: AssetDetailsProps) {
  const { formMethods, mockOptions, fileType, handleChangeFile, contentDetail } = props;
  return (
    <AssetsDetails
      formMethods={formMethods}
      mockOptions={mockOptions}
      fileType={fileType}
      handleChangeFile={handleChangeFile}
      contentDetail={contentDetail}
    />
  );
}
