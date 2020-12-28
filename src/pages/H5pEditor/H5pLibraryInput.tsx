import React from "react";
import { ContentTypeList } from "../../api/type";

export interface H5pLibraryInputProps {
  contentTypeList: ContentTypeList;
  onChange: (value: string) => any;
}

export function H5pLibraryInput(props: H5pLibraryInputProps) {
  const { contentTypeList, onChange } = props;
  return (
    <div>
      <button onClick={() => onChange("H5P.MultiChoice-1.14")}>select library: H5P.MultiChoice-1.14</button>
      <pre>{JSON.stringify(contentTypeList, null, 2)}</pre>
    </div>
  );
}
