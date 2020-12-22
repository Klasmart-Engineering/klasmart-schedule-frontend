import { createMuiTheme, createStyles, makeStyles, TextField, ThemeProvider, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { apiCreateContentTypeSchema } from "../../api/extra";
import mockContent from '../../mocks/multichoiceContent.json';
import { H5PItemInfo, h5pItemMapper, H5PItemType, H5PLibraryContent, H5PSchema, H5P_ROOT_NAME } from "../../models/ModelH5pSchema";
// import { RichTextInput } from "../../components/RichTextInput";

const useStyles = makeStyles(() => createStyles({
  library: {
    margin: 8,
    padding: 8,
    border: '1px dashed red',
  },
  group: {
    margin: 8,
    padding: 8,
    border: '1px dashed blue',
  },
  list: {
    margin: 8,
    padding: 8,
    border: '1px dashed black',
  },
  h5pItem: {
    margin: 8,
  }
}));

const useSchema = function(libId: string) {
  const [schema, setSchema] = useState<H5PSchema>();
  useEffect(() => {
    apiCreateContentTypeSchema<H5PSchema>(libId).then(setSchema);
  }, [setSchema, libId])
  return schema;
}

export function H5pDetails() {
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
  const [value, setValue] = useState('');
  const schema = useSchema(mockContent.library);
  // const contentInfo: H5PItemInfo = { path: '', content: mockContent, semantics: { name: 'root', type: 'library' }};
  const blankContent: H5PLibraryContent = {
    library: "H5P.MultiChoice-1.14",
    params: {},
    subContentId: '',
  };
  const contentInfo: H5PItemInfo = { path: '', content: blankContent, semantics: { name: H5P_ROOT_NAME, type: H5PItemType.library }};
  if (!schema) return null;
  const formContainer = h5pItemMapper<JSX.Element>(contentInfo, schema, (contentInfo, children) => {
    const { content, semantics, path } = contentInfo;
    switch(semantics.type) {
      case H5PItemType.library: 
        return <div className={css.library} key={path}> {children} </div>;
      case H5PItemType.group:
        return <div className={css.group} key={path}> {children} </div>;
      case H5PItemType.list:
        return <div className={css.list} key={path}> {children} </div>;
      default:
        return <TextField className={css.h5pItem} name={path} label={path} key={path}/>;
    }
  });
  return <ThemeProvider theme={theme}>{formContainer}</ThemeProvider>;
  // <RichTextInput defaultValue={value} onChange={setValue}/>

}
