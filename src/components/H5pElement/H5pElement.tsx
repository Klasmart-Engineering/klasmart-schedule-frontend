import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonProps,
  Checkbox,
  createStyles,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  styled,
  TextField,
} from "@material-ui/core";
import { Cancel, Close, CloudUploadOutlined, ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import React, { FocusEvent, FormEvent, Fragment, ReactNode, useMemo, useReducer } from "react";
import { apiResourcePathById } from "../../api/extra";
import { H5pFormRemoveListItemPayload } from "../../hooks/useH5pFormReducer";
import { d } from "../../locale/LocaleManager";
import {
  createH5pLicenseVersionOptions,
  H5PBooleanSemantic,
  H5PGroupSemantic,
  H5PImportance,
  H5PItemHelper,
  H5PItemInfo,
  H5PItemSemantic,
  H5PItemType,
  H5PLibrarySemantic,
  H5PLicense,
  H5PListSemantic,
  H5PMediaSemantic,
  H5PNumberSemantic,
  H5PSelectSemantic,
  H5PTextSemantic,
  H5P_LICENSE_OPTIONS,
  H5P_ROOT_NAME,
  isH5pListItemInfo,
  MapHandlerProps,
} from "../../models/ModelH5pSchema";
import { ProgressWithText } from "../../pages/ContentEdit/Details";
import { CropImage } from "../CropImage";
import { getImageDimension, SingleUploader, SingleUploaderProps } from "../SingleUploader";

export interface H5PBaseElementProps<S extends H5PItemSemantic> extends MapHandlerProps<JSX.Element, H5PItemHelper<S>> {
  className?: string;
  onChange?(itemInfo: H5PItemInfo<S>): any;
}

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    importanceBackgroundColor: ({ importance }: H5PItemSemantic) => ({
      backgroundColor:
        importance === H5PImportance.high ? palette.primary.dark : importance === H5PImportance.low ? palette.grey[200] : palette.grey[700],
    }),
    importanceColor: ({ importance }: H5PItemSemantic) => ({
      color: importance === H5PImportance.low ? palette.text.primary : "white",
    }),
  })
);

export type H5pElementProps =
  | H5pElementTextProps
  | H5pElementNumberProps
  | H5pElementBooleanProps
  | H5pElementSelectProps
  | H5pElementMediaProps
  | H5pElementListProps
  | H5pElementGroupProps
  | H5pElementRootLibraryProps
  | H5pElementCommonLibraryProps
  | H5pElementLibraryProps;
export function H5pElement(props: H5pElementProps) {
  if (isH5pElementText(props)) {
    return <H5pElementText {...props} />;
  }
  if (isH5pElementNumber(props)) {
    return <H5pElementNumber {...props} />;
  }
  if (isH5pElementBoolean(props)) {
    return <H5pElementBoolean {...props} />;
  }
  if (isH5pElementSelect(props)) {
    return <H5pElementSelect {...props} />;
  }
  if (isH5pElementImage(props)) {
    return <H5pElementImage {...props} />;
  }
  if (isH5pElementVideo(props)) {
    return <H5pElementVideo {...props} />;
  }
  if (isH5pElementAudio(props)) {
    return <H5pElementAudio {...props} />;
  }
  if (isH5pElementFile(props)) {
    return <H5pElementFile {...props} />;
  }
  if (isH5pElementList(props)) {
    return <H5pElementList {...props} />;
  }
  if (isH5pElementGroup(props)) {
    return <H5pElementGroup {...props} />;
  }
  if (isH5pElementLibrary(props)) {
    return <H5pElementLibrary {...props} />;
  }
  if (isH5pElementCommonLibrary(props)) {
    return <H5pElementCommonLibrary {...props} />;
  }
  if (isH5pElementRootLibrary(props)) {
    return <H5pElementRootLibrary {...props} />;
  }
  return <Fragment />;
}

export type H5pElementTextProps = H5PBaseElementProps<H5PTextSemantic>;
export function H5pElementText(props: H5pElementTextProps) {
  const {
    itemHelper: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <TextField
      className={className}
      required={!semantics.optional}
      name={path}
      label={semantics.label || semantics.name}
      onBlur={(e) => onChange && onChange({ semantics, path, content: e.target.value })}
    />
  );
}

export type H5pElementNumberProps = H5PBaseElementProps<H5PNumberSemantic>;
export function H5pElementNumber(props: H5pElementNumberProps) {
  const {
    itemHelper: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <TextField
      className={className}
      required={!semantics.optional}
      name={path}
      type="number"
      label={semantics.label || semantics.name}
      onBlur={(e) => onChange && onChange({ semantics, path, content: e.target.value ? Number(e.target.value) : undefined })}
    />
  );
}

export type H5pElementBooleanProps = H5PBaseElementProps<H5PBooleanSemantic>;
export function H5pElementBoolean(props: H5pElementBooleanProps) {
  const {
    itemHelper: { path, semantics },
    onChange,
    className,
  } = props;
  return (
    <FormControlLabel
      className={className}
      control={<Checkbox name={path} onBlur={(e) => onChange && onChange({ semantics, path, content: !!e.target.value })} />}
      label={semantics.label || semantics.name}
    />
  );
}

export type H5pElementSelectProps = H5PBaseElementProps<H5PSelectSemantic>;
export function H5pElementSelect(props: H5pElementSelectProps) {
  const {
    itemHelper: { path, semantics, content },
    onChange,
    className,
  } = props;
  return (
    <TextField
      select
      value={content ?? ""}
      required={!semantics.optional}
      label={semantics.label || semantics.name}
      className={className}
      onChange={(e) => onChange && onChange({ semantics, path, content: e.target.value })}
    >
      {semantics.options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
}

function CopyrightForm(props: H5pElementMediaProps) {
  const { classes, itemHelper, onChange } = props;
  const { semantics, path, content } = itemHelper;
  const copyright = content?.copyright;
  const license = copyright?.license;
  const inputData = useMemo(
    () =>
      [
        { label: "Title", name: "title", type: "text" },
        { label: "Author", name: "author", type: "text" },
        { label: "Year(s)", name: "year", type: "text" },
        { label: "Source", name: "source", type: "text" },
        { label: "License", name: "license", type: "select", required: true, options: H5P_LICENSE_OPTIONS },
        { label: "License Version", name: "version", type: "select", required: false, options: createH5pLicenseVersionOptions(license) },
      ] as const,
    [license]
  );
  console.log("copyright, content = ", copyright, content);
  if (!copyright || !content?.path) return null;
  const textFieldList = inputData.map((item) => {
    const handleChange = (e: FormEvent<HTMLInputElement> & FocusEvent<HTMLInputElement>) => {
      if (!onChange) return;
      onChange({ semantics, path, content: { ...content, copyright: { ...copyright, [item.name]: e.target.value } } });
    };
    switch (item.type) {
      case "text": {
        const { label, name } = item;
        return <TextField key={name} className={classes?.input} value={copyright[name]} label={label} onBlur={handleChange} />;
      }
      case "select": {
        const { label, name, options, required } = item;
        return (
          <TextField
            key={name}
            disabled={options.length === 0}
            select
            value={copyright[name] ?? ""}
            required={required}
            label={label}
            className={classes?.input}
            onChange={handleChange}
          >
            {(options as { label: string; value: string }[]).map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        );
      }
      default:
        return null;
    }
  });
  return <Fragment>{textFieldList}</Fragment>;
}

export interface H5pElementMediaProps extends H5PBaseElementProps<H5PMediaSemantic> {
  classes?: {
    root?: string;
    uploadButton?: string;
    copyrightButton?: string;
    mediaPreview?: string;
    input?: string;
  };
}
export function H5pElementMedia(props: H5pElementMediaProps) {
  const {
    itemHelper: { path, semantics, content },
    onChange,
    className,
    classes,
  } = props;
  const handleChangeFile: SingleUploaderProps["onChangeFile"] = (file) => {
    if (!file || !file.id || !onChange) return;
    const { id, type: mime } = file;
    onChange({ semantics, path, content: { ...content, path: id, mime } });
  };
  return (
    <SingleUploader
      partition="assets"
      accept="image/*,audio/*,video/*"
      onChangeFile={handleChangeFile}
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

export function H5pElementImage(props: H5pElementMediaProps) {
  const { itemHelper, onChange, className, classes } = props;
  const { path, semantics, content } = itemHelper;
  const handleChangeFile: SingleUploaderProps["onChangeFile"] = (file) => {
    if (!file || !file.id || !onChange) return;
    const { id, type: mime } = file;
    getImageDimension(file).then(({ width, height }) => {
      onChange({ semantics, path, content: { ...content, path: id, mime, width, height, copyright: { license: H5PLicense.U } } });
    });
  };
  return (
    <CropImage
      render={({ crop }) => (
        <SingleUploader
          partition="assets"
          accept="image/*"
          value={content?.path}
          transformFile={crop}
          onChangeFile={handleChangeFile}
          render={({ uploady, item, btnRef, value, isUploading }) => (
            <Box className={clsx(className, classes?.root)} display="flex">
              <Box display="flex" flexDirection="column" marginRight="auto">
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
                {content?.copyright && (
                  <DialogButton
                    variant="contained"
                    color="primary"
                    size="medium"
                    label="Edit copyright"
                    className={classes?.copyrightButton}
                  >
                    <CopyrightForm {...props} />
                  </DialogButton>
                )}
              </Box>
              {isUploading && <ProgressWithText value={item?.completed} />}
              {!isUploading && value && <img className={classes?.mediaPreview} alt="thumbnail" src={apiResourcePathById(value)} />}
            </Box>
          )}
        />
      )}
    />
  );
}

export type H5pElementImageProps = H5pElementMediaProps;
export type H5pElementVideoProps = H5pElementMediaProps;
export type H5pElementAudioProps = H5pElementMediaProps;
export type H5pElementFileProps = H5pElementMediaProps;
export const H5pElementVideo = H5pElementMedia;
export const H5pElementAudio = H5pElementMedia;
export const H5pElementFile = H5pElementMedia;

export interface H5pElementListProps extends H5PBaseElementProps<H5PListSemantic> {
  onAddListItem(itemInfo: H5PItemInfo<H5PListSemantic>): any;
  onRemoveListItem(itemInfo: Omit<H5pFormRemoveListItemPayload, "schema">): any;
  classes?: {
    root?: string;
    paragraph?: string;
    title?: string;
    description?: string;
    button?: string;
    closeIcon?: string;
    summary?: string;
    details?: string;
  };
}
export function H5pElementList(props: H5pElementListProps) {
  const { itemHelper, className, classes, children, onAddListItem, onRemoveListItem } = props;
  const { semantics } = itemHelper;
  const css = useStyles(semantics);
  const disableCloseBtn = children.length <= (semantics.min ?? 0);
  return (
    <div className={clsx(className, classes?.root)}>
      <div className={classes?.paragraph}>
        <InputLabel className={classes?.title} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <div className={classes?.description}>{semantics.description}</div>
      </div>
      {children.map((childNode, idx) => (
        <Accordion expanded key={itemHelper.childItems[idx].path}>
          <AccordionSummary
            expandIcon={<Cancel className={clsx(css.importanceColor, classes?.closeIcon)} />}
            IconButtonProps={{
              style: { display: disableCloseBtn ? "none" : undefined },
              onClick: () => onRemoveListItem({ ...itemHelper, index: idx }),
            }}
            classes={{ root: clsx(css.importanceBackgroundColor, css.importanceColor, classes?.summary) }}
          >
            {semantics.field.label ?? semantics.field.name}
          </AccordionSummary>
          <AccordionDetails className={classes?.details}>{childNode}</AccordionDetails>
        </Accordion>
      ))}
      <Button
        className={clsx(css.importanceBackgroundColor, css.importanceColor, classes?.button)}
        variant="contained"
        onClick={() => onAddListItem(itemHelper)}
      >
        ADD {semantics.entity?.toUpperCase() ?? "ITEM"}
      </Button>
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
    itemHelper: { semantics, parentItem },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  if (parentItem && isH5pListItemInfo(parentItem)) {
    return <Fragment>{children}</Fragment>;
  }
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion defaultExpanded={semantics.expanded ?? !semantics.optional}>
        <AccordionSummary
          expandIcon={<ExpandMore className={clsx(css.importanceColor, classes?.expandIcon)} />}
          classes={{ root: clsx(css.importanceBackgroundColor, css.importanceColor, classes?.summary) }}
        >
          {semantics.label || semantics.name}
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
    itemHelper: { semantics, content },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion expanded>
        <AccordionSummary classes={{ root: clsx(css.importanceBackgroundColor, css.importanceColor, classes?.summary) }}>
          {content?.library}
        </AccordionSummary>
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
    itemHelper: { semantics, content },
    className,
    classes,
    children,
  } = props;
  const css = useStyles(semantics);
  return (
    <div className={clsx(className, classes?.root)}>
      <Accordion expanded>
        <AccordionSummary classes={{ root: clsx(css.importanceBackgroundColor, css.importanceColor, classes?.summary) }}>
          {content?.library}
        </AccordionSummary>
        <AccordionDetails className={classes?.details}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}

export interface H5pElementLibraryProps extends H5PBaseElementProps<H5PLibrarySemantic> {
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
    itemHelper: { path, semantics, content },
    className,
    classes,
    onChange,
    children,
  } = props;
  if (semantics.options && semantics.options.length <= 1) {
    return (
      <div className={clsx(className, classes?.root)}>
        <div className={classes?.paragraph}>
          <div className={classes?.description}>{semantics.description}</div>
        </div>
        {children}
      </div>
    );
  }
  return (
    <div className={clsx(className, classes?.root)}>
      <div className={classes?.paragraph}>
        <InputLabel className={classes?.title} required={!semantics.optional}>
          {semantics.label || semantics.name}
        </InputLabel>
        <div className={classes?.description}>{semantics.description}</div>
      </div>
      <TextField
        select
        className={classes?.input}
        value={content?.library ?? ""}
        name={path}
        label={semantics.label || semantics.name}
        onChange={(e) => onChange && onChange({ semantics, path, content: { library: e.target.value } })}
      >
        {semantics.options?.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      {children}
    </div>
  );
}

export function isH5pElementText(props: H5pElementProps): props is H5pElementTextProps {
  return props.itemHelper.semantics.type === H5PItemType.text;
}

export function isH5pElementNumber(props: H5pElementProps): props is H5pElementNumberProps {
  return props.itemHelper.semantics.type === H5PItemType.number;
}

export function isH5pElementBoolean(props: H5pElementProps): props is H5pElementBooleanProps {
  return props.itemHelper.semantics.type === H5PItemType.boolean;
}

export function isH5pElementSelect(props: H5pElementProps): props is H5pElementSelectProps {
  return props.itemHelper.semantics.type === H5PItemType.select;
}

export function isH5pElementImage(props: H5pElementProps): props is H5pElementImageProps {
  return props.itemHelper.semantics.type === H5PItemType.image;
}

export function isH5pElementVideo(props: H5pElementProps): props is H5pElementVideoProps {
  return props.itemHelper.semantics.type === H5PItemType.video;
}

export function isH5pElementAudio(props: H5pElementProps): props is H5pElementAudioProps {
  return props.itemHelper.semantics.type === H5PItemType.audio;
}

export function isH5pElementFile(props: H5pElementProps): props is H5pElementFileProps {
  return props.itemHelper.semantics.type === H5PItemType.file;
}

export function isH5pElementGroup(props: H5pElementProps): props is H5pElementGroupProps {
  return props.itemHelper.semantics.type === H5PItemType.group;
}

export function isH5pElementList(props: H5pElementProps): props is H5pElementListProps {
  return props.itemHelper.semantics.type === H5PItemType.list;
}

export function isH5pElementLibrary(props: H5pElementProps): props is H5pElementLibraryProps {
  return (
    props.itemHelper.semantics.type === H5PItemType.library &&
    !props.itemHelper.semantics.extra?.isRenderCommon &&
    props.itemHelper.semantics.name !== H5P_ROOT_NAME
  );
}

export function isH5pElementCommonLibrary(props: H5pElementProps): props is H5pElementCommonLibraryProps {
  return props.itemHelper.semantics.type === H5PItemType.library && props.itemHelper.semantics.extra?.isRenderCommon;
}

export function isH5pElementRootLibrary(props: H5pElementProps): props is H5pElementRootLibraryProps {
  return props.itemHelper.semantics.type === H5PItemType.library && props.itemHelper.semantics.name === H5P_ROOT_NAME;
}

interface DialogButtonProps extends ButtonProps {
  label: ReactNode;
}
function DialogButton(props: DialogButtonProps) {
  const { label, children, ...buttonProps } = props;
  const [isOpen, toggle] = useReducer((isOpen) => !isOpen, false);
  const StyledDialogTitle = styled(DialogTitle)({
    textAlign: "right",
    paddingBottom: 0,
  });
  const StyledDialogContent = styled(DialogContent)({
    padding: "0 40px 40px",
  });
  return (
    <Fragment>
      <Button {...buttonProps} onClick={toggle}>
        {label}
      </Button>
      <Dialog open={isOpen}>
        <StyledDialogTitle>
          <Close onClick={toggle} />
        </StyledDialogTitle>
        <StyledDialogContent>{children}</StyledDialogContent>
      </Dialog>
    </Fragment>
  );
}
