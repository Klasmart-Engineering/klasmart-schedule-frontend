import React, { DOMAttributes } from "react";

export interface ExportCSVBtnProps {
  name: string;
  title: string;
  data: string[];
  label: string;
  onClick: () => boolean;
}
export function ExportCSVBtn(props: ExportCSVBtnProps) {
  const { name, title, data, label, onClick } = props;
  let str = `${title}\n`;
  data.forEach((item) => {
    str += `${item}\t\n`;
  });
  const uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  const handleClick: DOMAttributes<HTMLAnchorElement>["onClick"] = (e) => {
    if (onClick()) return;
    e.preventDefault();
  };
  return (
    <a style={{ textDecoration: "none", color: "rgba(0,0,0,0.87" }} href={uri} download={`${name}.csv`} onClick={handleClick}>
      {label}
    </a>
  );
}
