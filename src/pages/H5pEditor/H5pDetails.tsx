import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createMuiTheme,
  createStyles,
  InputLabel,
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
import React, { PropsWithChildren } from "react";
import { H5pFormChangePartialPayload, H5pFormValueBySemantics, useH5pFormReducer } from "../../hooks/useH5pFormReducer";
import { localeManager, reportMiss } from "../../locale/LocaleManager";
import {
  H5PContentBySemantics,
  H5PGroupSemantic,
  H5PImportance,
  H5PItemInfo,
  h5pItemMapper,
  H5PItemSemantic,
  H5PItemType,
  H5PLibraryContent,
  H5PLibraryInfo,
  H5PListSemantic,
  h5pName2libId,
  H5PSchema,
  H5P_ROOT_NAME,
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
  })
);

const useSectionStyles = makeStyles(({ palette }) =>
  createStyles({
    section: {
      marginBottom: 32,
    },
    sectionSummary: ({ importance }: SectionProps) => ({
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row-reverse",
      backgroundColor:
        importance === H5PImportance.high ? palette.primary.dark : importance === H5PImportance.low ? palette.grey[200] : palette.grey[700],
      textIndent: 8,
      color: importance === H5PImportance.low ? palette.text.primary : "white",
    }),
    sectionDetails: {
      padding: 32,
      flexDirection: "column",
      alignItems: "stretch",
    },
    expandIcon: ({ importance }) => ({
      color: importance === H5PImportance.low ? palette.text.primary : "white",
    }),
  })
);

interface InlineSectionProps {
  title?: string;
  description?: string;
  required?: boolean;
}
function InlineSection(props: PropsWithChildren<InlineSectionProps>) {
  const { title, description, required, children } = props;
  const css = useStyles();
  return (
    <div className={css.inlineSection}>
      <div className={css.inlineSectionParagraph}>
        <InputLabel className={css.title} required={required}>
          {title}
        </InputLabel>
        <div className={css.description}>{description}</div>
      </div>
      {children}
    </div>
  );
}

enum ExtendedSectionType {
  root = "root",
}
interface SectionProps {
  title?: string;
  defaultExpanded?: boolean;
  type: H5PItemType | ExtendedSectionType;
  importance?: H5PImportance;
}
function Section(props: PropsWithChildren<SectionProps>) {
  const { title, type, defaultExpanded, children } = props;
  const css = useSectionStyles(props);
  return (
    <div className={css.section}>
      <Accordion defaultExpanded={defaultExpanded} expanded={type === ExtendedSectionType.root ? true : undefined}>
        <AccordionSummary
          expandIcon={type === ExtendedSectionType.root ? undefined : <ExpandMore className={css.expandIcon} />}
          classes={{ root: css.sectionSummary }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails className={css.sectionDetails}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
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
  return function combinedNodeMapHandler(contentInfo, children, context) {
    const commonInline: H5PFormCombinedNode["commonInline"] = [];
    const common: H5PFormCombinedNode["common"] = [];
    const uncommonList = children.map(({ uncommon }) => uncommon).filter((x) => x) as JSX.Element[];
    children.forEach((child) => {
      commonInline.push(...child.commonInline);
      common.push(...child.common);
    });
    // library 元素的场景
    if (contentInfo.semantics.type === H5PItemType.library) {
      // library 的 common 值不能为真
      const uncommon = handler(contentInfo, uncommonList, context);
      if (commonInline.length === 0) return { uncommon, commonInline, common };
      const commonContentInfo = produce(contentInfo as unknown, (draft: H5PItemInfo) => {
        draft.semantics.extra = { isRenderCommon: true };
      }) as H5PItemInfo;
      common.unshift(handler(commonContentInfo, commonInline, context));
      return { uncommon, common, commonInline: [] };
    }
    // common 元素的场景
    if (contentInfo.semantics.common) {
      commonInline.push(handler(contentInfo, uncommonList, context));
      return { uncommon: undefined, commonInline, common };
    }
    // 非 common 元素的场景
    const uncommon = handler(contentInfo, uncommonList, context);
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
  const handleChange = <S extends Exclude<H5PItemSemantic, H5PGroupSemantic | H5PListSemantic>>(
    semantics: S,
    path: string,
    value: H5pFormValueBySemantics<S>
  ) => {
    dispatchChange({ path, semantics, value } as H5pFormChangePartialPayload);
  };
  if (!schema) return null;
  const { common, uncommon } = h5pItemMapper(
    libraryInfo,
    schema,
    makeCombinedNodeMapHandler((contentInfo, children) => {
      const { content, semantics, path } = contentInfo;
      switch (semantics.type) {
        case H5PItemType.library:
          const libraryContent = content as H5PContentBySemantics<typeof semantics>;
          if (semantics.extra?.isRenderCommon) {
            return (
              <Section
                title={libraryContent?.library}
                type={ExtendedSectionType.root}
                importance={H5PImportance.low}
                key={`common:${path}`}
              >
                {children}
              </Section>
            );
          }
          if (semantics.name === H5P_ROOT_NAME) {
            return (
              <Section title={libraryContent?.library} type={ExtendedSectionType.root} importance={H5PImportance.low}>
                {children}
              </Section>
            );
          }
          return (
            <InlineSection title={semantics.label} description={semantics.description} key={path}>
              <TextField
                select
                className={clsx(css.h5pItem, css.h5pItemQuarter)}
                value={libraryContent?.library ?? ""}
                name={path}
                label={semantics.label}
                key={path}
                onChange={(e) => handleChange(semantics, path, { library: e.target.value })}
              >
                {semantics.options?.map((name) => (
                  <MenuItem key={name} value={h5pName2libId(name)}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              {children}
            </InlineSection>
          );
        case H5PItemType.group:
          return (
            <Section
              title={semantics.label}
              type={semantics.type}
              key={path}
              importance={semantics.importance}
              defaultExpanded={semantics.expanded ?? !semantics.optional}
            >
              {children}
            </Section>
          );
        case H5PItemType.list:
          return (
            <InlineSection title={semantics.label} description={semantics.description} required={!semantics.optional} key={path}>
              {children}
            </InlineSection>
          );
        default:
          return (
            <TextField
              required={!semantics.optional}
              className={css.h5pItem}
              name={path}
              label={semantics.label}
              key={path}
              onChange={(e) => handleChange(semantics, path, e.target.value)}
            />
          );
      }
    })
  );
  return (
    <ThemeProvider theme={theme}>
      <div className={css.paper}>
        {uncommon}
        <Section
          title={reportMiss("Text overrides and translations", "h5p_label_commonFields")}
          type={H5PItemType.group}
          key="h5p-common-group"
          importance={H5PImportance.low}
        >
          <div className={css.commonDescription}>
            {reportMiss("Here you can edit settings or translate texts used in this content.", "h5p_label_commonFieldsDescription")}
            <TextField
              select
              label={reportMiss("Language", "h5p_label_language")}
              value={form?.metadata?.defaultLanguage ?? localeManager.intl?.locale ?? ""}
              className={clsx(css.languageInput, css.h5pItemHalf)}
              onChange={(e) => handleChange(libraryInfo.semantics, libraryInfo.path, { metadata: { defaultLanguage: e.target.value } })}
            >
              {commonOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {common}
        </Section>
      </div>
    </ThemeProvider>
  );
  // <RichTextInput defaultValue={value} onChange={setValue}/>
}
