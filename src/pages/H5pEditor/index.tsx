import React, { useState } from "react";
import { RichTextInput } from "../../components/RichTextInput";

export function H5pEditor() {
  const [value, setValue] = useState('');

  return (
    <RichTextInput defaultValue={value} onChange={setValue}/>
  )
}

H5pEditor.routeBasePath = "/h5pEditor";
H5pEditor.routeRedirectDefault = `/h5pEditor`;