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
import produce from "immer";
import React, { Fragment } from "react";
import {
  H5pElementBoolean,
  H5pElementCommonLibrary,
  H5pElementGroup,
  H5pElementLibrary,
  H5pElementList,
  H5pElementMedia,
  H5pElementNumber,
  H5pElementRootLibrary,
  H5pElementSelect,
  H5pElementText,
} from "../../components/H5pElement";
import { useH5pFormReducer } from "../../hooks/useH5pFormReducer";
import { localeManager, reportMiss } from "../../locale/LocaleManager";
import {
  H5PItemInfo,
  h5pItemMapper,
  H5PItemType,
  H5PLibraryContent,
  H5PLibraryInfo,
  H5PSchema,
  H5P_ROOT_NAME,
  isH5pAudioItemInfo,
  isH5pBooleanItemInfo,
  isH5pFileItemInfo,
  isH5pGroupItemInfo,
  isH5pImageItemInfo,
  isH5pLibraryItemInfo,
  isH5pListItemInfo,
  isH5pNumberItemInfo,
  isH5pSelectItemInfo,
  isH5pTextItemInfo,
  isH5pVideoItemInfo,
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
    const { itemInfo, children, context } = props;
    const commonInline: H5PFormCombinedNode["commonInline"] = [];
    const common: H5PFormCombinedNode["common"] = [];
    const uncommonList = children.map(({ uncommon }) => uncommon).filter((x) => x) as JSX.Element[];
    children.forEach((child) => {
      commonInline.push(...child.commonInline);
      common.push(...child.common);
    });
    // library 元素的场景
    if (itemInfo.semantics.type === H5PItemType.library) {
      // library 的 common 值不能为真
      const uncommon = handler({ itemInfo, children: uncommonList, context });
      if (commonInline.length === 0) return { uncommon, commonInline, common };
      const commonItemInfo = produce(itemInfo as unknown, (draft: H5PItemInfo) => {
        draft.semantics.extra = { isRenderCommon: true };
      }) as H5PItemInfo;
      common.unshift(handler({ itemInfo: commonItemInfo, children: commonInline, context }));
      return { uncommon, common, commonInline: [] };
    }
    // common 元素的场景
    if (itemInfo.semantics.common) {
      commonInline.unshift(handler({ itemInfo, children: uncommonList, context }));
      return { uncommon: undefined, commonInline, common };
    }
    // 非 common 元素的场景
    const uncommon = handler({ itemInfo, children: uncommonList, context });
    return { uncommon, commonInline, common };
  };
};
interface H5pDetailsProps {
  value: H5PLibraryContent;
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
  const libraryInfo: H5PLibraryInfo = { path: "", content: form, semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library } };
  if (!schema) return null;
  const { common, uncommon } = h5pItemMapper(
    libraryInfo,
    schema,
    makeCombinedNodeMapHandler(({ itemInfo, children, context }) => {
      const { semantics, path } = itemInfo;
      const widget =
        (semantics.type !== H5PItemType.list && semantics.widget) || (semantics.type === H5PItemType.list && semantics.widgets?.[0]);
      if (widget) {
        return <div>h5p widget</div>;
      }
      if (isH5pTextItemInfo(itemInfo)) {
        return <H5pElementText {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pNumberItemInfo(itemInfo)) {
        return <H5pElementNumber {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pBooleanItemInfo(itemInfo)) {
        return <H5pElementBoolean {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pSelectItemInfo(itemInfo)) {
        return <H5pElementSelect {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pImageItemInfo(itemInfo)) {
        return <H5pElementMedia {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pVideoItemInfo(itemInfo)) {
        return <H5pElementMedia {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pAudioItemInfo(itemInfo)) {
        return <H5pElementMedia {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pFileItemInfo(itemInfo)) {
        return <H5pElementMedia {...{ itemInfo, children, context }} onChange={dispatchChange} className={css.h5pItem} key={path} />;
      }
      if (isH5pListItemInfo(itemInfo)) {
        return (
          <H5pElementList
            {...{ itemInfo, children, context }}
            classes={{
              root: css.inlineSection,
              paragraph: css.inlineSectionParagraph,
              title: css.title,
              description: css.description,
            }}
            key={path}
          />
        );
      }
      if (isH5pGroupItemInfo(itemInfo)) {
        return (
          <H5pElementGroup
            {...{ itemInfo, children, context }}
            classes={{
              root: css.section,
              summary: css.sectionSummary,
              details: css.sectionDetails,
            }}
            key={path}
          />
        );
      }
      if (isH5pLibraryItemInfo(itemInfo)) {
        if (semantics.extra?.isRenderCommon) {
          return (
            <H5pElementCommonLibrary
              {...{ itemInfo, children, context }}
              classes={{
                root: css.section,
                summary: css.sectionSummary,
                details: css.sectionDetails,
              }}
              key={path}
            />
          );
        }
        if (semantics.name === H5P_ROOT_NAME) {
          return (
            <H5pElementRootLibrary
              {...{ itemInfo, children, context }}
              classes={{
                root: css.section,
                summary: css.sectionSummary,
                details: css.sectionDetails,
              }}
              key={path}
            />
          );
        }
        return (
          <H5pElementLibrary
            {...{ itemInfo, children, context }}
            onChange={dispatchChange}
            classes={{
              root: css.inlineSection,
              paragraph: css.inlineSectionParagraph,
              title: css.title,
              description: css.description,
              input: clsx(css.h5pItem, css.h5pItemQuarter),
            }}
            key={path}
          />
        );
      }
      return <Fragment />;
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
                  onChange={(e) => dispatchChange({ ...libraryInfo, content: { metadata: { defaultLanguage: e.target.value } } })}
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
