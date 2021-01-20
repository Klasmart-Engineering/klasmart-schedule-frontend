import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createMuiTheme,
  createStyles,
  makeStyles,
  MenuItem,
  TextField,
  ThemeProvider,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import React, { forwardRef } from "react";
import {
  H5pElement,
  H5pElementProps,
  isH5pElementAudio,
  isH5pElementBoolean,
  isH5pElementFile,
  isH5pElementGroup,
  isH5pElementImage,
  isH5pElementLibrary,
  isH5pElementList,
  isH5pElementNumber,
  isH5pElementSelect,
  isH5pElementText,
  isH5pElementVideo,
} from "../../components/H5pElement";
import { widgetElements } from "../../components/H5pWidget";
import { useH5pFormReducer } from "../../hooks/useH5pFormReducer";
import { localeManager, reportMiss } from "../../locale/LocaleManager";
import {
  H5pFormErrors,
  H5PItemHelper,
  h5pItemMapper,
  H5PItemType,
  H5PLibraryContent,
  H5PLibraryInfo,
  H5PSchema,
  H5P_ROOT_NAME,
  isH5pLibraryItemInfo,
  isH5pParentError,
  MapHandler,
} from "../../models/ModelH5pSchema";
import commonOptions from "./commonOptions.json";
// import { RichTextInput } from "../../components/RichTextInput";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    paper: {
      // padding: 20,
      // width: "50%",
      // margin: "0 auto",
    },
    h5pItem: {
      marginTop: 32,
    },
    h5pItemQuarter: {
      width: "25%",
    },
    h5pItemHalf: {
      width: "50%",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      lineHeight: 2,
    },
    description: {
      fontSize: 12,
    },
    buttonAdd: {
      fontWeight: "bold",
      marginTop: 32,
    },
    inlineSection: {
      marginTop: 32,
    },
    inlineSectionParagraph: {
      padding: 8,
    },
    commonDescription: {
      position: "relative",
      fontSize: 14,
      color: palette.text.secondary,
      minHeight: 80,
      paddingRight: "60%",
      lineHeight: 1.5,
    },
    languageInput: {
      position: "absolute",
      right: 0,
      top: 0,
    },
    section: {
      marginTop: 32,
    },
    sectionSummary: {
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row-reverse",
      textIndent: 8,
    },
    listEditorSummary: {
      flexDirection: "row",
    },
    sectionDetails: {
      padding: "0 32px 32px",
      flexDirection: "column",
      alignItems: "stretch",
    },
    mediaPreview: {
      width: 260,
      height: 132,
    },
    uploadButton: {
      height: 56,
    },
    copyrightButton: {
      marginTop: 16,
    },
  })
);

const extendedTheme = (size: string, sm: boolean) => ({
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

interface H5PFormCombinedNode {
  commonInline: JSX.Element[];
  common: JSX.Element[];
  uncommon: JSX.Element | undefined;
}
const makeCombinedNodeMapHandler = (handler: MapHandler<JSX.Element>): MapHandler<H5PFormCombinedNode> => {
  return function combinedNodeMapHandler(props) {
    const { itemHelper, children, context } = props;
    const commonInline: H5PFormCombinedNode["commonInline"] = [];
    const common: H5PFormCombinedNode["common"] = [];
    const uncommonList = children.map(({ uncommon }) => uncommon).filter((x) => x) as JSX.Element[];
    children.forEach((child) => {
      commonInline.push(...child.commonInline);
      common.push(...child.common);
    });
    // library 元素的场景
    if (isH5pLibraryItemInfo(itemHelper)) {
      // library 的 common 值不能为真
      const uncommon = handler({ itemHelper, children: uncommonList, context });
      if (commonInline.length === 0) return { uncommon, commonInline, common };
      const commonItemHelper: H5PItemHelper = {
        ...itemHelper,
        semantics: {
          ...itemHelper.semantics,
          extra: { isRenderCommon: true },
        },
      };
      common.unshift(handler({ itemHelper: commonItemHelper, children: commonInline, context }));
      return { uncommon, common, commonInline: [] };
    }
    // common 元素的场景
    if (itemHelper.semantics.common) {
      commonInline.unshift(handler({ itemHelper, children: uncommonList, context }));
      return { uncommon: undefined, commonInline, common };
    }
    // 非 common 元素的场景
    const uncommon = handler({ itemHelper, children: uncommonList, context });
    return { uncommon, commonInline, common };
  };
};

const pipe = <P, R>(f1: { (x: P): R }, f2: { (x: R): any }) => (x: P) => f2(f1(x));
const noop = (value: H5PLibraryContent) => {};
interface H5pDetailsProps {
  defaultValue: H5PLibraryContent;
  onChange?: (value: H5PLibraryContent) => any;
  schema: H5PSchema;
  errors: H5pFormErrors;
}
export const H5pDetails = forwardRef<HTMLDivElement, H5pDetailsProps>((props, ref) => {
  const { defaultValue, schema, onChange = noop, errors } = props;
  const css = useStyles();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  const theme = createMuiTheme(defaultTheme, extendedTheme(size, sm));
  const [form, { dispatchChange, dispatchAddListItem, dispatchRemoveListItem }] = useH5pFormReducer(defaultValue, schema, onChange);
  console.log("form = ", form);
  const libraryInfo: H5PLibraryInfo = {
    path: "",
    content: form,
    semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library },
  };

  if (!schema) return null;
  const {
    result: { common, uncommon },
  } = h5pItemMapper<H5PFormCombinedNode>(
    libraryInfo,
    schema,
    makeCombinedNodeMapHandler(({ itemHelper, children, context }) => {
      const { semantics, path } = itemHelper;
      const widget =
        (semantics.type !== H5PItemType.list && semantics.widget) ||
        (semantics.type === H5PItemType.list && semantics.widgets?.[0].name) ||
        undefined;
      const Widget = widget && widgetElements[widget];
      let elementProps = { itemHelper, children, context } as H5pElementProps;
      if (
        isH5pElementText(elementProps) ||
        isH5pElementNumber(elementProps) ||
        isH5pElementBoolean(elementProps) ||
        isH5pElementSelect(elementProps)
      ) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          onChange: pipe(dispatchChange, onChange),
          error: errors[path],
          className: css.h5pItem,
          classes: {
            paragraph: css.inlineSectionParagraph,
            description: css.description,
          },
        };
        elementProps = extendedProps;
      } else if (
        isH5pElementImage(elementProps) ||
        isH5pElementVideo(elementProps) ||
        isH5pElementAudio(elementProps) ||
        isH5pElementFile(elementProps)
      ) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          onChange: pipe(dispatchChange, onChange),
          error: errors[path],
          classes: {
            root: css.h5pItem,
            input: css.h5pItem,
            uploadButton: css.uploadButton,
            copyrightButton: css.copyrightButton,
            mediaPreview: css.mediaPreview,
            paragraph: css.inlineSectionParagraph,
            title: css.title,
            description: css.description,
          },
        };
        elementProps = extendedProps;
      } else if (isH5pElementList(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          formErrors: errors,
          classes: {
            root: css.inlineSection,
            paragraph: css.inlineSectionParagraph,
            title: css.title,
            description: css.description,
            button: css.buttonAdd,
            summary: clsx(css.sectionSummary, css.listEditorSummary),
            details: css.sectionDetails,
          },
          onAddListItem: dispatchAddListItem,
          onRemoveListItem: dispatchRemoveListItem,
          onChange: pipe(dispatchChange, onChange),
        };
        elementProps = extendedProps;
      } else if (isH5pElementGroup(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          error: isH5pParentError(path, errors),
          classes: {
            root: css.section,
            summary: css.sectionSummary,
            details: css.sectionDetails,
          },
          onChange: pipe(dispatchChange, onChange),
        };
        elementProps = extendedProps;
      } else if (isH5pElementLibrary(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          onChange: pipe(dispatchChange, onChange),
          classes: {
            root: css.inlineSection,
            paragraph: css.inlineSectionParagraph,
            title: css.title,
            description: css.description,
            input: clsx(css.h5pItem, css.h5pItemQuarter),
          },
        };
        elementProps = extendedProps;
      } else {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          classes: {
            root: css.section,
            summary: css.sectionSummary,
            details: css.sectionDetails,
          },
          onChange: pipe(dispatchChange, onChange),
        };
        elementProps = extendedProps;
      }
      itemHelper.node = Widget ? <Widget {...elementProps} key={path} /> : <H5pElement {...elementProps} key={path} />;
      return itemHelper.node;
    })
  );
  return (
    <ThemeProvider theme={theme}>
      <div className={css.paper} ref={ref}>
        {uncommon}
        <div className={css.section} key="h5p-common-group">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />} classes={{ root: css.sectionSummary }}>
              {reportMiss("Text overrides and translations", "h5p_label_commonFields")}
            </AccordionSummary>
            <AccordionDetails className={css.sectionDetails}>
              <div className={css.commonDescription}>
                {reportMiss("Here you can edit settings or translate texts used in this content.", "h5p_label_commonFieldsDescription")}
                <TextField
                  select
                  label={reportMiss("Language", "h5p_label_language")}
                  value={form?.metadata?.defaultLanguage ?? localeManager.intl?.locale ?? ""}
                  className={clsx(css.languageInput, css.h5pItemHalf)}
                  onChange={(e) =>
                    pipe(
                      dispatchChange,
                      onChange
                    )({ ...libraryInfo, content: { library: "", metadata: { defaultLanguage: e.target.value } } })
                  }
                >
                  {commonOptions.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {common}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </ThemeProvider>
  );
});
