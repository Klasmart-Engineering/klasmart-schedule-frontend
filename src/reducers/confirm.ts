import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ControllerProps } from "react-hook-form";

export interface ConfirmResult {
  isConfirmed: boolean;
  reasonValue?: string[];
  otherValue?: string;
  text?: string;
}

export interface ConfirmRequest {
  title?: string;
  content?: string;
  type?: ConfirmDialogType;
  label?: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  rules?: ControllerProps<"input">["rules"];
}

export interface IConfirmState extends ConfirmRequest {
  open: boolean;
}

export enum ConfirmDialogType {
  text = "text",
  textField = "textField",
  onlyInput = "onlyInput",
}

const initialState: IConfirmState = {
  open: false,
  title: "",
  content: "",
  type: ConfirmDialogType.text,
  label: "",
  confirmText: "",
  cancelText: "",
  placeholder: "",
  rules: undefined,
};

let resolve: (value?: ConfirmResult | PromiseLike<ConfirmResult>) => void;

const { actions, reducer } = createSlice({
  name: "confirm",
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<ConfirmRequest>) {
      Object.assign(state, payload, { open: true });
    },
    actExitConfirm(state, { payload }: PayloadAction<ConfirmResult>) {
      Object.assign(state, initialState);
      resolve(payload);
    },
  },
});

export const actAsyncConfirm = createAsyncThunk<ConfirmResult, ConfirmRequest>(
  "confirm/actAsyncConfirm",
  async (confirmRequest, { dispatch }) => {
    dispatch(actions.show(confirmRequest));
    return new Promise<ConfirmResult>((r) => {
      resolve = r;
    });
  }
);

export const { actExitConfirm } = actions;
export default reducer;
