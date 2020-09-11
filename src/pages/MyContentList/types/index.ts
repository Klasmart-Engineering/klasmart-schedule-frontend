import api from "../../../api";
import { ContentIDListRequest } from "../../../api/api";

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
  [ContentListFormKey.CHECKED_CONTENT_IDS]: NonNullable<ContentIDListRequest["id"]>;
}

export enum Assets {
  assets_type = "3",
  assets_name = "Assets",
}
