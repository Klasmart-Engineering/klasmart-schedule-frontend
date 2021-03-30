import api from "../../../api";
import { ApiContentBulkOperateRequest, EntityCreateFolderRequest } from "../../../api/api.auto";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};
export type QueryCondition = { exect_search?: string } & NonNullRecordValue<NonNullable<Parameters<typeof api.contents.searchContents>[0]>>;
export type QueryConditionChangeHandler = (value: QueryCondition) => any;
export type QueryConditionBaseProps = {
  onChange: QueryConditionChangeHandler;
  value: QueryCondition;
};

export enum ContentListFormKey {
  CHECKED_CONTENT_IDS = "CHECKED_CONTENT_IDS",
  SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY",
  EXECT_SEARCH = "EXECT_SEARCH",
  FOLDER_NAME = "FOLDER_NAME",
  REMARK = "REMARK",
  KEYWORDS = "KEYWORDS",
}

export interface ContentListForm {
  [ContentListFormKey.CHECKED_CONTENT_IDS]: NonNullable<ApiContentBulkOperateRequest["id"]>;
  [ContentListFormKey.SEARCH_TEXT_KEY]: string;
  [ContentListFormKey.EXECT_SEARCH]: string;
  [ContentListFormKey.FOLDER_NAME]: NonNullable<EntityCreateFolderRequest["name"]>;
  [ContentListFormKey.REMARK]: NonNullable<EntityCreateFolderRequest["description"]>;
  [ContentListFormKey.KEYWORDS]: NonNullable<EntityCreateFolderRequest["keywords"]>;
}

export enum PublishScope {
  organization = "visibility_settings1,visibility_settings2",
  all = "all",
  tempArgument = "10f38ce9-5152-4049-b4e7-6d2e2ba884e6",
}
