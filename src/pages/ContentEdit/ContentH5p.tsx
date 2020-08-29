import { TextField } from "@material-ui/core";
import React, { ReactNode } from "react";

interface DataH5p {
  source?: string;
}
interface ContentH5pProps {
  children?: ReactNode;
  value?: DataH5p;
  onChange?: (value: DataH5p) => any;
}
export default function ContentH5p(props: ContentH5pProps) {
  const { value, onChange } = props;
  return (
    <>
      {props.children}
      <TextField onChange={(e) => onChange && onChange({ source: e.target.value })} defaultValue={value} label="h5p mock id" required />
    </>
  );
}
