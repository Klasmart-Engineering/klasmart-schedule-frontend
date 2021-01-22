import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentFileType, ContentInputSourceType, ContentTypeList } from "../../api/type";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import {
  H5PItemType,
  h5plibId2Name,
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

const useLibraryAndDefaultContent = (valueSource?: string, inputSource?: ContentInputSourceType) => {
  const [, setLibrary] = useState<string>();
  return useMemo(() => {
    let defaultLibContent = inputSource === ContentInputSourceType.h5p && valueSource ? parseLibraryContent(valueSource) : undefined;
    let library = inputSource === ContentInputSourceType.h5p && valueSource ? defaultLibContent?.library : undefined;
    const setLib = (v: string) => {
      library = v;
      defaultLibContent = { library: h5plibId2Name(library) };
      setLibrary(v);
    };
    const getLibAndDefaultContent = () => ({ library, defaultLibContent });
    return [getLibAndDefaultContent, setLib] as const;
  }, [valueSource, setLibrary, inputSource]);
};

interface H5pComposeEditorProps {
  valueSource?: string;
  dataInputSource?: ContentInputSourceType;
  formMethods: UseFormMethods<ContentDetailForm>;
  assetEditor: JSX.Element;
}
export function H5pComposeEditor(props: H5pComposeEditorProps) {
  const { valueSource, formMethods, dataInputSource, assetEditor } = props;
  const { control, errors, watch, setValue } = formMethods;
  // todo: delete next line
  const formDataInputSource: ContentInputSourceType = watch("data.input_source");
  const [getLibAndDefaultContent, setLibrary] = useLibraryAndDefaultContent(valueSource, formDataInputSource);
  const { library, defaultLibContent } = getLibAndDefaultContent();
  const contentTypeList = useContentTypeList();
  const { schema, schemaPending } = useSchema(library);
  const [expand, setExpand] = React.useState<boolean>(dataInputSource === ContentInputSourceType.h5p && !library);
  const validate = (value: string) => {
    if (!schema) return false;
    const content = parseLibraryContent(value);
    const rootLibrarySchema: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
    const { result } = validateContent({ content, semantics: rootLibrarySchema, path: "" }, schema);
    return Object.keys(result).length === 0 ? true : JSON.stringify(result);
  };
  const handleChangeLibrary = (libraryId: string) => {
    setValue("data.input_source", ContentInputSourceType.h5p);
    setLibrary(libraryId);
  };
  return (
    <Fragment>
      <ExpandContent
        onExpand={setExpand}
        expand={expand}
        contentTypeList={contentTypeList as ContentTypeList}
        value={library}
        onChange={handleChangeLibrary}
      />
      <Controller name="data.input_source" defaultValue={dataInputSource} control={control} as="input" hidden />
      {formDataInputSource === ContentInputSourceType.h5p
        ? !schemaPending &&
          schema &&
          library && (
            <Fragment>
              {formDataInputSource === ContentInputSourceType.h5p && (
                <Controller name="data.file_type" defaultValue={ContentFileType.h5pExtend} control={control} as="input" hidden />
              )}
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
            </Fragment>
          )
        : assetEditor}
    </Fragment>
  );
}
