import { AsyncThunk } from "@reduxjs/toolkit";
import { LangRecordId } from "../locale/lang/type";

export interface IPermissionState {
  permission: {
    [key in LangRecordId]?: boolean | undefined;
  };
}

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
export type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
