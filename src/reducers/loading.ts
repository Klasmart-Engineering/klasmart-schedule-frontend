import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ILoadingState {
  loading: boolean;
}

const initialState: ILoadingState = {
  loading: false,
};

const { actions, reducer } = createSlice({
  name: "loading",
  initialState,
  reducers: {
    actSetLoading: (state, { payload }: PayloadAction<ILoadingState["loading"]>) => {
      state.loading = payload;
    },
  },
});

export const { actSetLoading } = actions;
export default reducer;
