import { LangRecordId } from "../locale/lang/type";

export interface IPermissionState {
  permission: {
    [key in LangRecordId]?: boolean | undefined;
  };
}
