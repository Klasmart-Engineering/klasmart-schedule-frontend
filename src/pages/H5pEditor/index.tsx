import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { H5PLibraryContent, H5PSchema } from "../../models/ModelH5pSchema";
import ExpandContent from "./ExpandContent";
import { H5pCompare } from "./H5pCompare";
import { H5pDetails } from "./H5pDetails";

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
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [libContent, setLibContent] = useState<H5PLibraryContent>();
  const [library, setLibrary] = useLibrary(query.get("library") || undefined);
  const contentTypeList = useContentTypeList();
  const schema = useSchema(library);
  const [contentType, setContentType] = React.useState("");
  const [expand, setExpand] = React.useState<boolean>(true);

  return (
    <div>
      <ExpandContent
        setExpand={setExpand}
        expand={expand}
        contentTypeList={contentTypeList as ContentTypeList}
        contentType={contentType}
        onChange={setLibrary}
        setContentType={setContentType}
        schema={schema as H5PSchema}
      />
      {!schema ? null : (
        <Fragment>
          <H5pCompare value={libContent} />
          {library && schema && <H5pDetails value={{ library }} schema={schema} onChange={setLibContent} />}
        </Fragment>
      )}
    </div>
  );
}

H5pEditor.routeBasePath = "/h5pEditor";
