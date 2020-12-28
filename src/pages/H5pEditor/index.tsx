import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { H5PSchema } from "../../models/ModelH5pSchema";
import { H5pDetails } from "./H5pDetails";
import { H5pLibraryInput } from "./H5pLibraryInput";
// import { RichTextInput } from "../../components/RichTextInput";

const useSchema = (library?: string) => {
  const [schema, setSchema] = useState<H5PSchema>();
  useEffect(() => {
    if (!library) return;
    apiCreateContentTypeSchema<H5PSchema>(library).then(setSchema);
  }, [setSchema, library]);
  return schema;
};

const useContentTypeList = () => {
  const [contentTypeList, setContentTypeList] = useState<ContentTypeList>();
  useEffect(() => {
    apiGetContentTypeList().then(setContentTypeList);
  }, []);
  return contentTypeList;
};

const useLibrary = (libraryOfContent?: string) => {
  const [userSpecifiedLibrary, setUserSpecifiedLibrary] = useState<string>();
  const library = libraryOfContent ?? userSpecifiedLibrary;
  return [library, setUserSpecifiedLibrary] as const;
};

export function H5pEditor() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [library, setLibrary] = useLibrary(query.get("library") || undefined);
  const contentTypeList = useContentTypeList();
  const schema = useSchema(library);
  if (!library) return !contentTypeList ? null : <H5pLibraryInput onChange={setLibrary} contentTypeList={contentTypeList} />;
  return !schema ? null : <H5pDetails value={{ library }} schema={schema} />;
}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor`;
