import React from "react";
import { H5pElement, H5pElementProps } from "../H5pElement";

export function WidgetElement(props: H5pElementProps) {
  return <H5pElement {...props} />;
}

export const version = "1.0.0";
export const name = "H5PEditor.Html";
export const title = "html";
