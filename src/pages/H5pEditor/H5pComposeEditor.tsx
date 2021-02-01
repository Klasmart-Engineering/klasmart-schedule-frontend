import React, { cloneElement, Fragment, useEffect, useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentFileType, ContentInputSourceType, ContentTypeList } from "../../api/type";
import { ContentDetailForm } from "../../models/ModelContentDetailForm";
import {
  H5PItemType,
  H5PLibrarySemantic,
  h5pName2libId,
  H5PSchema,
  H5P_ROOT_NAME,
  parseH5pErrors,
  parseLibraryContent,
  validateContent,
} from "../../models/ModelH5pSchema";
import { CreateAllDefaultValueAndKeyResult } from "../../models/ModelMockOptions";
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
    let recycle = false;
    apiGetContentTypeList().then((v) => {
      if (recycle) return;
      setContentTypeList(v);
    });
    return () => {
      recycle = true;
    };
  }, []);
  return contentTypeList;
};

interface UseLibraryAndDefaultContentProps {
  valueSource?: string;
  dataFileType?: ContentFileType;
}
const useLibraryAndDefaultContent = (props: UseLibraryAndDefaultContentProps) => {
  const { valueSource, dataFileType } = props;
  const [, refresh] = useState<string | ContentFileType>();
  return useMemo(() => {
    let isAssetLibrary: boolean | undefined =
      dataFileType === ContentFileType.image ||
      dataFileType === ContentFileType.video ||
      dataFileType === ContentFileType.audio ||
      dataFileType === ContentFileType.doc
        ? true
        : dataFileType === ContentFileType.h5pExtend
        ? false
        : undefined;
    let defaultLibContent = isAssetLibrary === false && valueSource ? parseLibraryContent(valueSource) : undefined;
    let library = isAssetLibrary === false && valueSource ? defaultLibContent?.library : undefined;
    let assetLibraryId = isAssetLibrary === true ? dataFileType : undefined;
    const setLib = (v: string) => {
      isAssetLibrary = false;
      library = v;
      defaultLibContent = { library };
      assetLibraryId = undefined;
      refresh(v);
    };
    const setAssetLib = (v: ContentFileType) => {
      isAssetLibrary = true;
      assetLibraryId = v;
      library = undefined;
      defaultLibContent = undefined;
      refresh(v);
    };
    const getLibAndDefaultContent = () => ({ library, defaultLibContent, assetLibraryId });
    return [getLibAndDefaultContent, setLib, setAssetLib] as const;
  }, [valueSource, dataFileType]);
};

interface H5pComposeEditorProps {
  formMethods: UseFormMethods<ContentDetailForm>;
  assetEditor: JSX.Element;
  allDefaultValueAndKey: CreateAllDefaultValueAndKeyResult;
  onChangeDataSource: (value: string) => any;
  dataInputSource: ContentInputSourceType;
  onChangeDataInputSource: (value: ContentInputSourceType) => any;
}
export function H5pComposeEditor(props: H5pComposeEditorProps) {
  const {
    formMethods,
    assetEditor,
    allDefaultValueAndKey,
    dataInputSource: formDataInputSource,
    onChangeDataInputSource,
    onChangeDataSource,
  } = props;
  const { control, errors } = formMethods;
  const valueSource = allDefaultValueAndKey["data.content"]?.value;
  const dataInputSource = allDefaultValueAndKey["data.input_source"]?.value;
  const dataFileType = allDefaultValueAndKey["data.file_type"]?.value;
  const [getLibAndDefaultContent, setLibrary, setAssetLib] = useLibraryAndDefaultContent({ valueSource, dataFileType });

  const { library, assetLibraryId, defaultLibContent } = getLibAndDefaultContent();
  const contentTypeList = useContentTypeList();
  const { schema, schemaPending } = useSchema(library);
  const [expand, setExpand] = React.useState<boolean>(!dataInputSource || (dataInputSource === ContentInputSourceType.h5p && !library));
  const validate = (value: string) => {
    if (!schema) return false;
    const content = parseLibraryContent(value);
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
        assetLibraryId={assetLibraryId}
        onChange={(v) => [setLibrary(v), onChangeDataInputSource(ContentInputSourceType.h5p), onChangeDataSource("")]}
        onChangeAssetLibraryId={(v) => [setAssetLib(v), onChangeDataInputSource(ContentInputSourceType.fromFile), onChangeDataSource("")]}
      />
      {formDataInputSource === ContentInputSourceType.h5p && !schemaPending && schema && library && (
        <Controller
          name="data.content"
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
              errors={parseH5pErrors((errors as any)?.data?.content?.message)}
            />
          )}
        />
      )}
      {(formDataInputSource === ContentInputSourceType.fromFile || formDataInputSource === ContentInputSourceType.fromAssets) &&
        cloneElement(assetEditor, { assetLibraryId, key: assetLibraryId })}
    </Fragment>
  );
}
