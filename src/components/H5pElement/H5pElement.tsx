import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { CloudUploadOutlined, ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { apiResourcePathById } from "../../api/extra";
import { d } from "../../locale/LocaleManager";
import {
  H5PBooleanSemantic,
  H5PContentBySemantics,
  H5PGroupSemantic,
  H5PImportance,
  H5PItemInfo,
  H5PItemSemantic,
  H5PLibrarySemantic,
  H5PListSemantic,
  H5PMediaSemantic,
  H5PNumberSemantic,
  H5PSelectSemantic,
  H5PSingleItemInfo,
  H5PTextSemantic,
  MapHandlerProps,
} from "../../models/ModelH5pSchema";
import { ProgressWithText } from "../../pages/ContentEdit/Details";
import { SingleUploader } from "../SingleUploader";

export const h5pName2libId = (option: string) => option.replace(" ", "-");

export interface H5PBaseElementProps<S extends H5PItemSemantic> extends MapHandlerProps<JSX.Element, H5PSingleItemInfo<S>> {
  className?: string;
}
export interface H5PLeafElementProps<S extends H5PItemSemantic> extends H5PBaseElementProps<S> {
  onChange(itemInfo: H5PItemInfo<S, H5PContentBySemantics<S>>): any;
}

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    summary: ({ importance }: H5PItemSemantic) => ({
      backgroundColor:
        importance === H5PImportance.high ? palette.primary.dark : importance === H5PImportance.low ? palette.grey[200] : palette.grey[700],
      color: importance === H5PImportance.low ? palette.text.primary : "white",
    }),
    expandIcon: ({ importance }: H5PItemSemantic) => ({
      color: importance === H5PImportance.low ? palette.text.primary : "white",
    }),
  })
);

export function H5pElementText(props: H5PLeafElementProps<H5PTextSemantic>) {
  const {
    itemInfo: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <TextField
      className={className}
      required={!semantics.optional}
      name={path}
      label={semantics.label}
      onChange={(e) => onChange({ semantics, path, content: e.target.value })}
    />
  );
}

export function H5pElementNumber(props: H5PLeafElementProps<H5PNumberSemantic>) {
  const {
    itemInfo: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <TextField
      className={className}
      required={!semantics.optional}
      name={path}
      type="number"
      label={semantics.label}
      onChange={(e) => onChange({ semantics, path, content: e.target.value ? Number(e.target.value) : undefined })}
    />
  );
}

export function H5pElementBoolean(props: H5PLeafElementProps<H5PBooleanSemantic>) {
  const {
    itemInfo: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <FormControlLabel
      className={className}
      control={<Checkbox name={path} onChange={(e) => onChange({ semantics, path, content: !!e.target.value })} />}
      label={semantics.label}
    />
  );
}

export function H5pElementSelect(props: H5PLeafElementProps<H5PSelectSemantic>) {
  const {
    itemInfo: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <TextField
      select
      required={!semantics.optional}
      label={semantics.label}
      className={className}
      onChange={(e) => onChange({ semantics, path, content: e.target.value })}
    >
      {semantics.options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export interface H5pElementMediaProps extends H5PLeafElementProps<H5PMediaSemantic> {
  classes?: {
    root?: string;
    uploadButton?: string;
    mediaPreview?: string;
  };
}
export function H5pElementMedia(props: H5pElementMediaProps) {
  const {
    itemInfo: { path, semantics },
    onChange,
    className,
    classes,
  } = props;
  return (
    <SingleUploader
      partition="assets"
      accept="image/*,audio/*,video/*"
      onChange={(id) => onChange({ semantics, path, content: { path: id as string, mime: "image/jpeg" } })}
      render={({ uploady, item, btnRef, value, isUploading }) => (
        <Box className={clsx(className, classes?.root)} display="flex">
          <Button
            className={classes?.uploadButton}
            ref={btnRef}
            size="medium"
            variant="contained"
            component="span"
            color="primary"
            endIcon={<CloudUploadOutlined />}
          >
            {d("Upload from Device").t("library_label_upload_from_device")}
          </Button>
          {isUploading && <ProgressWithText value={item?.completed} />}
          {!isUploading && value && <img className={classes?.mediaPreview} alt="thumbnail" src={apiResourcePathById(value)} />}
        </Box>
      )}
    />
  );
}

export interface H5pElementListProps extends H5PBaseElementProps<H5PListSemantic> {
  classes?: {
    root?: string;
    paragraph?: string;
    title?: string;
    description?: string;
  };
}
export function H5pElementList(props: H5pElementListProps) {
  const {
    itemInfo: { semantics },
    className,
    classes,
    children,
  } = props;
  return (
    <div className={clsx(className, classes?.root)}>
      <div className={classes?.paragraph}>
        <InputLabel className={classes?.title} required={!semantics.optional}>
          {semantics.label}
        </InputLabel>
        <div className={classes?.description}>{semantics.description}</div>
      </div>
      {children}
    </div>
  );
}

export interface H5pElementGroupProps extends H5PBaseElementProps<H5PGroupSemantic> {
  classes?: {
    root?: string;
    expandIcon?: string;
    summary?: string;
    details?: string;
  };
}
export function H5pElementGroup(props: H5pElementGroupProps) {
  const {
    itemInfo: { semantics },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion defaultExpanded={semantics.expanded ?? !semantics.optional}>
        <AccordionSummary
          expandIcon={<ExpandMore className={clsx(css.expandIcon, classes?.expandIcon)} />}
          classes={{ root: clsx(css.summary, classes?.summary) }}
        >
          {semantics.label}
        </AccordionSummary>
        <AccordionDetails className={classes?.details}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export interface H5pElementRootLibraryProps extends H5PBaseElementProps<H5PLibrarySemantic> {
  classes?: {
    root?: string;
    summary?: string;
    details?: string;
  };
}
export function H5pElementRootLibrary(props: H5pElementRootLibraryProps) {
  const {
    itemInfo: { semantics, content },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion expanded>
        <AccordionSummary classes={{ root: clsx(css.summary, classes?.summary) }}>{content?.library}</AccordionSummary>
        <AccordionDetails className={classes?.details}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export interface H5pElementCommonLibraryProps extends H5PBaseElementProps<H5PLibrarySemantic> {
  classes?: {
    root?: string;
    summary?: string;
    details?: string;
  };
}
export function H5pElementCommonLibrary(props: H5pElementCommonLibraryProps) {
  const {
    itemInfo: { semantics, content },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion expanded>
        <AccordionSummary classes={{ root: clsx(css.summary, classes?.summary) }}>{content?.library}</AccordionSummary>
        <AccordionDetails className={classes?.details}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export interface H5pElementLibraryProps extends H5PLeafElementProps<H5PLibrarySemantic> {
  classes?: {
    root?: string;
    paragraph?: string;
    title?: string;
    description?: string;
    input?: string;
  };
}
export function H5pElementLibrary(props: H5pElementLibraryProps) {
  const {
    itemInfo: { path, semantics, content },
    className,
    classes,
    onChange,
    children,
  } = props;
  return (
    <div className={clsx(className, classes?.root)}>
      <div className={classes?.paragraph}>
        <InputLabel className={classes?.title} required={!semantics.optional}>
          {semantics.label}
        </InputLabel>
        <div className={classes?.description}>{semantics.description}</div>
      </div>
      <TextField
        select
        className={classes?.input}
        value={content?.library ?? ""}
        name={path}
        label={semantics.label}
        onChange={(e) => onChange({ semantics, path, content: { library: e.target.value } })}
      >
        {semantics.options?.map((name) => (
          <MenuItem key={name} value={h5pName2libId(name)}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      {children}
    </div>
  );
}
