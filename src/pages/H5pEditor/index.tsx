import { Box, Button } from "@material-ui/core";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { apiCreateContentTypeSchema, apiGetContentTypeList } from "../../api/extra";
import { ContentTypeList } from "../../api/type";
import { localeManager } from "../../locale/LocaleManager";
import {
  H5PItemType,
  H5PLibraryContent,
  H5PLibrarySemantic,
  h5pName2libId,
  H5PSchema,
  H5P_ROOT_NAME,
  parseH5pErrors,
  validateContent,
} from "../../models/ModelH5pSchema";
import ExpandContent from "./ExpandContent";
import { H5pCompare } from "./H5pCompare";
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
    const locale = localeManager.getLocale();
    if (!locale) return;
    apiCreateContentTypeSchema<H5PSchema>(h5pName2libId(library), locale).then((v) => {
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
export function H5pEditor() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [library, setLibrary] = useState(query.get("library") || undefined);
  const { control, handleSubmit, errors, watch } = useForm<{ data: H5PLibraryContent }>();
  const libContent = watch("data");
  const contentTypeList = useContentTypeList();
  const { schema, schemaPending } = useSchema(library);
  const [expand, setExpand] = React.useState<boolean>(!library);
  const validate = (content: H5PLibraryContent) => {
    if (!schema) return false;
    const rootLibrarySchema: H5PLibrarySemantic = { type: H5PItemType.library, name: H5P_ROOT_NAME };
    const { result } = validateContent({ content, semantics: rootLibrarySchema, path: "" }, schema);
    return JSON.stringify(result);
  };
  return (
    <div>
      <Box width="50%" p={2.5} mt={0} mx="auto">
        {false && (
          <ExpandContent
            onExpand={setExpand}
            expand={expand}
            contentTypeList={contentTypeList as ContentTypeList}
            value={library}
            onChange={setLibrary}
          />
        )}
        {schemaPending ? null : (
          <Fragment>
            <H5pCompare value={libContent} />
            {library && schema && (
              <Fragment>
                <Controller
                  name="data"
                  defaultValue={library ? { library } : undefined}
                  rules={{ validate }}
                  control={control}
                  key={library}
                  render={(props) => (
                    <H5pDetails
                      defaultValue={props.value}
                      onChange={props.onChange}
                      schema={schema}
                      errors={parseH5pErrors((errors.data as any)?.message)}
                    />
                  )}
                />
                <Box display="flex" justifyContent="center" mt={4}>
                  <Button color="primary" variant="contained" onClick={handleSubmit(() => {})}>
                    validate
                  </Button>
                </Box>
              </Fragment>
            )}
          </Fragment>
        )}
      </Box>
      {/* <DndProvider backend={HTML5Backend}>
      <ImagePair data={JSON.parse(h5pImagePairJson.data).content} px={1} />
      </DndProvider> */}
    </div>
  );
}

H5pEditor.routeBasePath = "/h5pEditor";
