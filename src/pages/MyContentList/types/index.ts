import api from "../../../api";
import { ContentIDListRequest } from "../../../api/api";

export type QueryCondition = NonNullable<Parameters<typeof api.contents.searchContents>[0]>;
export type QueryConditionChangeHandler = (value: QueryCondition) => any;
export type QueryConditionBaseProps = {
  onChange: QueryConditionChangeHandler;
  value: QueryCondition;
}

export enum ContentListFormKey {
  CHECKED_CONTENT_IDS = 'CHECKED_CONTENT_IDS',
} 

export interface ContentListForm {
  [ContentListFormKey.CHECKED_CONTENT_IDS]: NonNullable<ContentIDListRequest['id']>;
}