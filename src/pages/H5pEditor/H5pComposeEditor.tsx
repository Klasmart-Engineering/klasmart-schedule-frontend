import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import {
  H5PItemType,
  h5plibId2Name,
  H5PLibraryContent,
  H5PLibrarySemantic,
  h5pName2libId,
  H5PSchema,
  H5P_ROOT_NAME,
  parseH5pErrors,
  parseLibraryContent,
  validateContent,
} from "../../models/ModelH5pSchema";
import ExpandContent from "./ExpandContent";
import { H5pDetails } from "./H5pDetails";

const useSchema = (library?: string) => {
  const [schema, setSchema] = useState<H5PSchema>();
  const [getPending, setPending] = useMemo(() => {
    let pending = true;
    const getPending = () => pending;
    const setPending = (v: boolean) => (pending = v);
    return [getPending, setPending];
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [library]);
  const pending = getPending();
  useEffect(() => {
    if (!library) return;
    apiCreateContentTypeSchema<H5PSchema>(h5pName2libId(library)).then((v) => {
      setPending(false);
      setSchema(v);
    });
  }, [library, setSchema, setPending]);
  return { schema, schemaPending: pending };
};

const useContentTypeList = () => {
  const [contentTypeList, setContentTypeList] = useState<ContentTypeList>();
  useEffect(() => {
    apiGetContentTypeList().then(setContentTypeList);
  }, []);
  return contentTypeList;
};

const useLibraryAndDefaultContent = (valueSource?: string) => {
  const [, setLibrary] = useState<string>();
  return useMemo(() => {
    let defaultLibContent = valueSource ? parseLibraryContent(valueSource) : undefined;
    let library = valueSource ? defaultLibContent?.library : undefined;
    const setLib = (v: string) => {
      library = v;
      defaultLibContent = { library: h5plibId2Name(library) };
      setLibrary(v);
    };
    const getLibAndDefaultContent = () => ({ library, defaultLibContent });
    return [getLibAndDefaultContent, setLib] as const;
  }, [valueSource, setLibrary]);
};

interface H5pComposeEditorProps {
  valueSource?: string;
  formMethods: UseFormMethods<ContentDetailForm>;
}
export function H5pComposeEditor(props: H5pComposeEditorProps) {
  const { valueSource, formMethods } = props;
  const [getLibAndDefaultContent, setLibrary] = useLibraryAndDefaultContent(valueSource);
  const { library, defaultLibContent } = getLibAndDefaultContent();

  const { control, errors } = formMethods;
  const contentTypeList = useContentTypeList();
  const { schema, schemaPending } = useSchema(library);
  const [expand, setExpand] = React.useState<boolean>(!library);
  const validate = (content: H5PLibraryContent) => {
    if (!schema) return false;
    const rootLibrarySchema: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
    const { result } = validateContent({ content, semantics: rootLibrarySchema, path: "" }, schema);
    return Object.keys(result).length === 0 ? true : JSON.stringify(result);
  };
  return (
    <Fragment>
      <ExpandContent
        onExpand={setExpand}
        expand={expand}
        contentTypeList={contentTypeList as ContentTypeList}
        value={library}
        onChange={setLibrary}
      />
      {!schemaPending && schema && library && (
        <Controller
          name="data.source"
          defaultValue={JSON.stringify(defaultLibContent)}
          rules={{ validate }}
          control={control}
          key={`library:${library},valueSource:${valueSource}`}
          render={(props) => (
            <H5pDetails
              defaultValue={defaultLibContent}
              onChange={(v) => {
                const stringValue = JSON.stringify(v);
                if (stringValue === props.value) return;
                props.onChange(JSON.stringify(v));
              }}
              schema={schema}
              errors={parseH5pErrors((errors as any)?.data?.source?.message)}
            />
          )}
        />
      )}
    </Fragment>
  );
}
