import React, { useEffect, useState } from "react";
import { apiCreateContentTypeSchema } from "../../api/extra";
import { H5PSchema } from "../../models/ModelH5pSchema";
import { H5pDetails } from "./H5pDetails";
// import { RichTextInput } from "../../components/RichTextInput";

const useSchema = function(library: string) {
  const [schema, setSchema] = useState<H5PSchema>();
  useEffect(() => {
    apiCreateContentTypeSchema<H5PSchema>(library).then(setSchema);
  }, [setSchema, library])
  return schema;
}

export function H5pEditor() {
  const library = 'H5P.MultiChoice-1.14';
  const schema = useSchema(library);
  if (!schema) return null;
  return <H5pDetails value={{ library }} schema={schema} />

}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor`;