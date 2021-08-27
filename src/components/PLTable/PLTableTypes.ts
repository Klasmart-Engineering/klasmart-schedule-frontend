import React, { ReactNode } from "react";

declare interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
}

export declare type PLSortType = undefined | "asc" | "desc";
/** 表头参数 **/
export interface PLField extends CommonProps {
  text: string | ReactNode;
  value: string;
  align?: "center" | "inherit" | "left" | "right" | "justify";
  width?: number | string | undefined;
  sortable?: boolean;
  hidden?: boolean;
  sortType?: PLSortType;
}

/** 行数据类型： 以表头的 value 为 key **/
export declare type PLGridRowData = {
  [key: string]: any;
};

/** 表头参数 类型 **/
export interface PLTableHeaderProps extends CommonProps {
  fields: PLField[] /** 表头字段 **/;
  loading?: boolean;
  rows?: PLGridRowData[];
  classes?: string;
  emitSort?: (sortField: string, event?: React.MouseEvent<unknown>) => void /** 排序回调 **/;
  sortField?: string /** 当前排序字段: 可选值为 field 的 value 字段 **/;
}

/** 表头参数 类型 **/
export interface TableComponents {
  row?: React.JSXElementConstructor<any>;
}

/** 表格参数 类型 **/
export interface PLTableProps extends CommonProps {
  fields: PLField[];
  rows: PLGridRowData[];
  loading?: boolean;
  components?: TableComponents;
  sortChange?: (curField: PLField | undefined, event?: React.MouseEvent<unknown>) => void;
  clickRows?: (curRows: PLGridRowData | undefined, event?: React.MouseEvent<unknown>) => void;
  dblclickRows?: (curRows: PLGridRowData | undefined, event?: React.MouseEvent<unknown>) => void;
}
