import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommonState {
  organization_id: string;
}

const initialState: CommonState = {
  organization_id: "",
};

const { actions, reducer } = createSlice({
  name: "common",
  initialState,
  reducers: {
    setOrganizationId: (state, { payload }: PayloadAction<CommonState["organization_id"]>) => {
      state.organization_id = payload;
    },
  },
});
export const { setOrganizationId } = actions;
export default reducer;
