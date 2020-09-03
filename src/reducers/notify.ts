import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

type Equal<X1, X2, T, F> = (<X>() => X extends X1 ? 1 : 2) extends <X>() => X extends X2 ? 1 : 2 ? T : F;
type NoneReadonlyKeysOf<T> = {
  [Key in keyof T]: Equal<{ [K in Key]: T[K] }, { -readonly [K in Key]: T[K] }, ReadonlyArray<any> extends T[Key] ? never : Key, never>;
}[keyof T];
type NoneReadonly<T> = Pick<T, NoneReadonlyKeysOf<T>>;

export interface NotifyMessage extends NoneReadonly<OptionsObject> {
  key: SnackbarKey;
  label: SnackbarMessage;
}
export interface INotifyState extends Record<string, NotifyMessage> {}

const genKey = () => Date.now().toString();

const initialState: INotifyState = {};

const createNotifyReducer = (variant: NotifyMessage["variant"]) => (
  state: INotifyState,
  { payload }: PayloadAction<NotifyMessage | string>
) => {
  const key = genKey();
  if (typeof payload === "string") {
    state[key] = { key, label: payload, variant };
  } else {
    state[key] = { ...payload, key, variant };
  }
};

const { actions, reducer } = createSlice({
  name: "notify",
  initialState,
  reducers: {
    actWarning: createNotifyReducer("warning"),
    actError: createNotifyReducer("error"),
    actInfo: createNotifyReducer("info"),
    actSuccess: createNotifyReducer("success"),
    actRemove: (state, { payload: key }: PayloadAction<SnackbarKey>) => {
      if (!key) return initialState;
      delete state[key];
    },
  },
});

export const { actWarning, actError, actInfo, actSuccess, actRemove } = actions;
export default reducer;
