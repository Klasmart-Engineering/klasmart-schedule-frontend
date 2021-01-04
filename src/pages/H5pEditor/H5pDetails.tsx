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
import React from "react";
import {
  H5pElement,
  H5pElementProps,
  isH5pElementAudio,
  isH5pElementBoolean,
  isH5pElementCommonLibrary,
  isH5pElementFile,
  isH5pElementGroup,
  isH5pElementImage,
  isH5pElementLibrary,
  isH5pElementList,
  isH5pElementNumber,
  isH5pElementRootLibrary,
  isH5pElementSelect,
  isH5pElementText,
  isH5pElementVideo,
} from "../../components/H5pElement";
import { widgetElements } from "../../components/H5pWidget";
import { useH5pFormReducer } from "../../hooks/useH5pFormReducer";
import { localeManager, reportMiss } from "../../locale/LocaleManager";
import {
  H5PItemHelper,
  h5pItemMapper,
  H5PItemType,
  H5PLibraryContent,
  H5PLibraryInfo,
  H5PSchema,
  H5P_ROOT_NAME,
  isH5pLibraryItemInfo,
  MapHandler,
} from "../../models/ModelH5pSchema";
import commonOptions from "./commonOptions.json";
// import { RichTextInput } from "../../components/RichTextInput";

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    paper: {
      padding: 20,
      width: "50%",
      margin: "0 auto",
    },
    h5pItem: {
      marginBottom: 32,
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
    inlineSection: {},
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
      marginBottom: 32,
    },
    sectionSummary: {
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row-reverse",
      textIndent: 8,
    },
    sectionDetails: {
      padding: 32,
      flexDirection: "column",
      alignItems: "stretch",
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

// const pipe = <P,R>(f1: {(x: P): R}, f2: {(x:R):any}) => (x: P) => f2(f1(x));

interface H5pDetailsProps {
  value: H5PLibraryContent;
  // onChange: (value: H5PLibraryContent) => any;
  schema: H5PSchema;
}
export function H5pDetails(props: H5pDetailsProps) {
  const { value, schema } = props;
  const css = useStyles();
  const defaultTheme = useTheme();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  const size = sm ? "small" : "medium";
  const theme = createMuiTheme(defaultTheme, extendedTheme(size, sm));
  const [form, { dispatchChange }] = useH5pFormReducer(value, schema);
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
        isH5pElementSelect(elementProps) ||
        isH5pElementImage(elementProps) ||
        isH5pElementVideo(elementProps) ||
        isH5pElementAudio(elementProps) ||
        isH5pElementFile(elementProps)
      ) {
        const extendedProps: typeof elementProps = { ...elementProps, onChange: dispatchChange, className: css.h5pItem };
        elementProps = extendedProps;
      }
      if (isH5pElementList(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          classes: {
            root: css.inlineSection,
            paragraph: css.inlineSectionParagraph,
            title: css.title,
            description: css.description,
          },
        };
        elementProps = extendedProps;
      }
      if (isH5pElementGroup(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          classes: {
            root: css.section,
            summary: css.sectionSummary,
            details: css.sectionDetails,
          },
        };
        elementProps = extendedProps;
      }
      if (isH5pElementLibrary(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          onChange: dispatchChange,
          classes: {
            root: css.inlineSection,
            paragraph: css.inlineSectionParagraph,
            title: css.title,
            description: css.description,
            input: clsx(css.h5pItem, css.h5pItemQuarter),
          },
        };
        elementProps = extendedProps;
      }
      if (isH5pElementCommonLibrary(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          classes: {
            root: css.section,
            summary: css.sectionSummary,
            details: css.sectionDetails,
          },
        };
        elementProps = extendedProps;
      }
      if (isH5pElementRootLibrary(elementProps)) {
        const extendedProps: typeof elementProps = {
          ...elementProps,
          classes: {
            root: css.section,
            summary: css.sectionSummary,
            details: css.sectionDetails,
          },
        };
        elementProps = extendedProps;
      }
      if (Widget) return <Widget {...elementProps} key={path} />;
      return <H5pElement {...elementProps} key={path} />;
    })
  );
  return (
    <ThemeProvider theme={theme}>
      <div className={css.paper}>
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
                    dispatchChange({ ...libraryInfo, content: { library: "", metadata: { defaultLanguage: e.target.value } } })
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
  // <RichTextInput defaultValue={value} onChange={setValue}/>
}
