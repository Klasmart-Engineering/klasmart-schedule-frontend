import React, { ReactNode, useEffect } from "react";

interface DataH5p {
  source: string;
}
interface ContentH5pProps {
  children?: ReactNode;
  value?: DataH5p;
  onChange?: (value: DataH5p) => any;
}
export default function ContentH5p(props: ContentH5pProps) {
  const { value, onChange } = props;
  useEffect(() => {
    if (!value?.source && onChange)
      setTimeout(() => {
        onChange({ source: "source1" });
      }, 1000);
  }, [value, onChange]);
  return <>{props.children}h5p content</>;
}
