import React from "react";
import { H5pDetails } from "./H5pDetails";
// import { RichTextInput } from "../../components/RichTextInput";



export function H5pEditor() {
  return <H5pDetails />
}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor`;