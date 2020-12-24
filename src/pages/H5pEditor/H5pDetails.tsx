import { Accordion, AccordionDetails, AccordionSummary, createMuiTheme, createStyles, InputLabel, makeStyles, MenuItem, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { H5pFormChangePartialPayload, H5pFormValueBySemantics, useH5pFormReducer } from "../../hooks/useH5pFormReducer";
import { H5PContentBySemantics, H5PGroupSemantic, H5PImportance, h5pItemMapper, H5PItemSemantic, H5PItemType, H5PLibraryContent, H5PLibraryInfo, H5PListSemantic, h5pName2libId, H5PSchema, H5P_ROOT_NAME } from "../../models/ModelH5pSchema";
// import { RichTextInput } from "../../components/RichTextInput";

const useStyles = makeStyles(({ palette }) => createStyles({
  paper: {
    padding: 20,
    width: '50%',
    margin: '0 auto',
  },
  h5pItem: {
    marginBottom: 32,
  },
  h5pItemQuarter: {
    width: '25%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 2,
  },
  description: {
    fontSize: 12,
  },
  inlineSection: {
  },
  inlineSectionParagraph: {
    padding: 8,
  },
}));

const useSectionStyles = makeStyles(({ palette }) => createStyles({
  section: {
    marginBottom: 32,
  },
  sectionSummary: ({ importance }: SectionProps) => ({
    fontSize: 16,
    fontWeight: 'bold',
    flexDirection: 'row-reverse',
    backgroundColor: 
      importance === H5PImportance.high ? palette.primary.dark : 
      importance === H5PImportance.low ? palette.grey[200] :
      palette.grey[700],
    textIndent: 8,
    color: importance === H5PImportance.low ? palette.text.primary : 'white',
  }),
  sectionDetails: {
    padding: 32,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  expandIcon: ({ importance }) => ({
    color: importance === H5PImportance.low ? palette.text.primary : 'white',
  }),
}));

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
        <InputLabel className={css.title} required={required}>{title}</InputLabel>
        <div className={css.description}>{description}</div>
      </div>
      {children}
    </div>
  );
};

enum ExtendedSectionType {
  root = 'root',
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
          expandIcon={type === ExtendedSectionType.root ? undefined : <ExpandMore className={css.expandIcon}/>}
          classes={{ root: css.sectionSummary }}
        >
          {title}
        </AccordionSummary>
        <AccordionDetails className={css.sectionDetails}>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
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
  const [form, { dispatchChange }] = useH5pFormReducer(value, schema);
  const libraryInfo: H5PLibraryInfo = { path: '', content: form, semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library }};
  const handleChange = <S extends Exclude<H5PItemSemantic, H5PGroupSemantic | H5PListSemantic>>(semantics: S, path: string, value: H5pFormValueBySemantics<S>) => {
    dispatchChange({ path, semantics, value } as H5pFormChangePartialPayload);
  };
  if (!schema) return null;
  const formContainer = h5pItemMapper<JSX.Element>(libraryInfo, schema, (contentInfo, children) => {
    const { content, semantics, path } = contentInfo;
    switch(semantics.type) {
      case H5PItemType.library: 
        const libraryContent = content as H5PContentBySemantics<typeof semantics>;
        if (semantics.name === H5P_ROOT_NAME) {
          return (
            <Section
              title={libraryContent?.library}
              type={ExtendedSectionType.root}
              importance={H5PImportance.low}
            >
              {children}
            </Section>
          );
        }
        return (
          <InlineSection title={semantics.label} description={semantics.description} key={path}>
            <TextField
              select
              className={clsx(css.h5pItem, css.h5pItemQuarter)}
              value={libraryContent?.library ?? ''}
              name={path}
              label={semantics.label}
              key={path}
              onChange={e => handleChange(semantics, path, e.target.value)}>
              {semantics.options?.map(name => (
                <MenuItem key={name} value={h5pName2libId(name)}>{name}</MenuItem>
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
            onChange={e => handleChange(semantics, path, e.target.value)}
          />
        );
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <div className={css.paper}>
        {formContainer}
      </div>
    </ThemeProvider>
  );
  // <RichTextInput defaultValue={value} onChange={setValue}/>

}
