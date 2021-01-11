import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { H5PLibraryContent, H5PSchema } from "../../models/ModelH5pSchema";
import { H5pCompare } from "./H5pCompare";
import { H5pDetails } from "./H5pDetails";
import H5pHeaderNavbar from "./H5pHeaderNavBar";
import H5pInfo from "./H5pInfo";
import { H5pLibraryInput } from "./H5pLibraryInput";

const useSchema = (library?: string) => {
  const [schema, setSchema] = useState<H5PSchema>();
  useEffect(() => {
    if (!library) return;
    apiCreateContentTypeSchema<H5PSchema>(library).then(setSchema);
  }, [library, setSchema]);
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
  const { show } = useParams<{ show: string }>();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const history = useHistory();
  const [libContent, setLibContent] = useState<H5PLibraryContent>();
  const [library, setLibrary] = useLibrary(query.get("library") || undefined);
  const contentTypeList = useContentTypeList();
  const schema = useSchema(library);
  const [contentType, setContentType] = React.useState("");

  useEffect(() => {
    if (!schema) {
      history.push(H5pEditor.routeRedirectDefault);
    }
  }, [history, schema]);

  return (
    <div>
      <H5pHeaderNavbar contentType={contentType} />
      {show === "list" && contentTypeList && (
        <H5pLibraryInput onChange={setLibrary} contentTypeList={contentTypeList} setContentType={setContentType} schema={schema as any} />
      )}
      {show === "details" &&
        (!schema ? null : (
          <Fragment>
            <H5pCompare value={libContent} />
            {show === "details" && library && schema && <H5pDetails value={{ library }} schema={schema} onChange={setLibContent} />}
          </Fragment>
        ))}
      {show === "info" && contentTypeList && <H5pInfo contentTypeList={contentTypeList} />}
    </div>
  );
}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor/show/list`;
H5pEditor.routeMatchPath = "/h5pEditor/show/:show";
