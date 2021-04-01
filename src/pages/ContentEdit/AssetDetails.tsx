import { Box, Button, createMuiTheme, makeStyles, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { CloudUploadOutlined } from "@material-ui/icons";
import React from "react";
import { Controller, FieldError, UseFormMethods } from "react-hook-form";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById, MockOptionsItem } from "../../api/extra";
import { CropImage } from "../../components/CropImage";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField, frontTrim } from "../../components/FormattedTextField";
import { SingleUploader } from "../../components/SingleUploader";
import { d } from "../../locale/LocaleManager";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import { CreateAllDefaultValueAndKeyResult } from "../../models/ModelMockOptions";
import { LinkedMockOptions } from "../../reducers/content";
import { ProgressWithText } from "./Details";

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
  assetsHeader: {
    fontSize: "20px",
    fontWeight: "bold",
    height: "64px",
    paddingLeft: "30px",
    lineHeight: "64px",
    backgroundColor: palette.grey[200],
    boxShadow: shadows[3],
  },
  detailBox: {
    boxShadow: shadows[3],
  },
}));

interface AssetDetailsProps {
  allDefaultValueAndKey: CreateAllDefaultValueAndKeyResult;
  formMethods: UseFormMethods<ContentDetailForm>;
  flattenedMockOptions: LinkedMockOptions;
  contentDetail: EntityContentInfoWithDetails;
  onChangeProgram: (value: NonNullable<ContentDetailForm["program"]>) => any;
  onChangeDevelopmental: (value: NonNullable<ContentDetailForm["developmental"]>) => any;
  onChangeSubject: (value: string[]) => any;
}
export default function AssetsDetails(props: AssetDetailsProps) {
  const css = useStyles();
  const {
    formMethods: { control, errors },
    flattenedMockOptions,
    contentDetail,
    onChangeProgram,
    onChangeDevelopmental,
    onChangeSubject,
    allDefaultValueAndKey,
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

  const errorValidator = (filed: (FieldError | undefined)[] | FieldError | undefined): boolean => {
    return filed ? true : false;
  };

  const isIdExist = (): boolean => {
    return contentDetail.id ? true : false;
  };

  return (
    <div className={css.detailBox}>
      <Box className={css.assetsHeader}>{d("Details").t("library_label_details")}</Box>
      <ThemeProvider theme={theme}>
        <Box component="form" p="7.8% 8.5%">
          <Controller
            as={FormattedTextField}
            control={control}
            name="name"
            label={d("Asset Name").t("library_label_asset_name")}
            required
            encode={frontTrim}
            decode={frontTrim}
            rules={{ required: true }}
            defaultValue={allDefaultValueAndKey.name?.value}
            key={allDefaultValueAndKey.name?.key}
            disabled={isIdExist()}
            error={errorValidator(errors.name)}
          />
          <Controller
            name="thumbnail"
            defaultValue={allDefaultValueAndKey.thumbnail?.value}
            key={allDefaultValueAndKey.thumbnail?.key}
            control={control}
            render={(props: any) => (
              <CropImage
                aspectRatio={16 / 9}
                render={({ crop }) => (
                  <SingleUploader
                    partition="thumbnail"
                    accept="image/*"
                    transformFile={crop}
                    {...props}
                    render={({ uploady, item, btnRef, value, isUploading }) => (
                      <Box display="flex" className={css.fieldset}>
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

          <Controller
            name="program"
            defaultValue={allDefaultValueAndKey.program?.value}
            key={allDefaultValueAndKey.program?.key}
            control={control}
            rules={{ required: true }}
            render={(props: any) => (
              <TextField
                select
                className={css.fieldset}
                label={d("Program").t("library_label_program")}
                {...props}
                onChange={(e) => {
                  onChangeProgram(e.target.value);
                  props.onChange(e.target.value);
                }}
                disabled={isIdExist()}
                required
                error={errorValidator(errors.program)}
              >
                {menuItemList(flattenedMockOptions.program || [])}
              </TextField>
            )}
          />

          {/* <Controller
            as={TextField}
            select
            className={css.fieldset}
            label={d("Subject").t("library_label_subject")}
            name="subject"
            control={control}
            SelectProps={{ multiple: true }}
            defaultValue={allDefaultValueAndKey.subject?.value}
            key={allDefaultValueAndKey.subject?.key}
            disabled={isIdExist()}
          >
            {menuItemList(flattenedMockOptions.subject || [])}
          </Controller> */}
          <Controller
            name="subject"
            defaultValue={allDefaultValueAndKey.subject?.value}
            key={allDefaultValueAndKey.subject?.key}
            control={control}
            render={(props) => (
              <TextField
                select
                SelectProps={{
                  multiple: true,
                }}
                className={css.fieldset}
                label={d("Subject").t("library_label_subject")}
                disabled={isIdExist()}
                {...props}
                onChange={(e) => {
                  const value = (e.target.value as unknown) as string[];
                  value.length > 0 && onChangeSubject(value);
                  value.length > 0 && props.onChange(value);
                }}
              >
                {menuItemList(flattenedMockOptions.subject || [])}
              </TextField>
            )}
          />
          <Box>
            <Controller
              name="developmental"
              defaultValue={allDefaultValueAndKey.developmental?.value}
              key={allDefaultValueAndKey.developmental?.key}
              control={control}
              rules={{ required: true }}
              render={(props: any) => (
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
                  error={errorValidator(errors.developmental)}
                  disabled={isIdExist()}
                >
                  {menuItemList(flattenedMockOptions.developmental || [])}
                </FormattedTextField>
              )}
            />

            <Controller
              as={TextField}
              name="skills"
              control={control}
              select
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              label={d("Subcategory").t("library_label_subcategory")}
              rules={{ required: true }}
              error={errorValidator(errors.skills)}
              SelectProps={{ multiple: true }}
              defaultValue={allDefaultValueAndKey.skills?.value}
              key={allDefaultValueAndKey.skills?.key}
              disabled={isIdExist()}
            >
              {menuItemList(flattenedMockOptions.skills || [])}
            </Controller>
          </Box>
          <Box>
            <Controller
              as={TextField}
              name="age"
              control={control}
              select
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              label={d("Age").t("library_label_age")}
              rules={{ required: true }}
              error={errorValidator(errors.age)}
              SelectProps={{ multiple: true }}
              defaultValue={allDefaultValueAndKey.age?.value}
              key={allDefaultValueAndKey.age?.key}
              disabled={isIdExist()}
            >
              {menuItemList(flattenedMockOptions.age || [])}
            </Controller>
            <Controller
              as={TextField}
              name="grade"
              control={control}
              select
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              label={d("Grade").t("library_label_grade")}
              rules={{ required: true }}
              error={errorValidator(errors.grade)}
              SelectProps={{ multiple: true }}
              defaultValue={allDefaultValueAndKey.grade?.value}
              key={allDefaultValueAndKey.grade?.key}
              disabled={isIdExist()}
            >
              {menuItemList(flattenedMockOptions.grade || [])}
            </Controller>
          </Box>
          <Controller
            as={TextField}
            control={control}
            name="description"
            className={css.fieldset}
            label={d("Description").t("library_label_description")}
            defaultValue={allDefaultValueAndKey.description?.value}
            key={allDefaultValueAndKey.description?.key}
            disabled={isIdExist()}
          />
          <Controller
            as={FormattedTextField}
            control={control}
            name="keywords"
            decode={decodeArray}
            className={css.fieldset}
            label={d("Keywords").t("library_label_keywords")}
            defaultValue={allDefaultValueAndKey.keywords?.value}
            key={allDefaultValueAndKey.keywords?.key}
            disabled={isIdExist()}
          />
        </Box>
      </ThemeProvider>
    </div>
  );
}
