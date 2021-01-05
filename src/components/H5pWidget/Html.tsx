import React from "react";
import { H5pElement, H5pElementProps, isH5pElementText } from "../H5pElement";
import { RichTextInput } from "../RichTextInput";

export function WidgetElement(props: H5pElementProps) {
  if (isH5pElementText(props)) {
    const { itemHelper, onChange } = props;
    const { content } = itemHelper;
    return <RichTextInput defaultValue={content} onBlur={(html) => onChange && onChange({ ...itemHelper, content: html })} />;
  }
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.Html";
export const title = "html";
