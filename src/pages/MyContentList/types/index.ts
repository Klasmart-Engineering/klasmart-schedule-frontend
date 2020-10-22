import api from "../../../api";
import { ApiContentBulkOperateRequest } from "../../../api/api.auto";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};
export type QueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.contents.searchContents>[0]>>;
export type QueryConditionChangeHandler = (value: QueryCondition) => any;
export type QueryConditionBaseProps = {
  onChange: QueryConditionChangeHandler;
  value: QueryCondition;
};

export enum ContentListFormKey {
  CHECKED_CONTENT_IDS = "CHECKED_CONTENT_IDS",
}

export interface ContentListForm {
  [ContentListFormKey.CHECKED_CONTENT_IDS]: NonNullable<ApiContentBulkOperateRequest["id"]>;
}

export enum PublishScope {
  organization = "visibility settings1,visibility settings2",
  all = "all",
}
