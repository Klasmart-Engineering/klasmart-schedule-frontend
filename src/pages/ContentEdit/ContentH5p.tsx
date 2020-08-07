import React, { ReactNode } from "react";

interface ContentH5pProps {
  children: ReactNode;
}
export default function ContentH5p(props: ContentH5pProps) {
  return <>{props.children}h5p content</>;
}
