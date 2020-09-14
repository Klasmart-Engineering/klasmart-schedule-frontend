import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGetTranslation, LocaleName } from "../api/extra";

interface ILocaleState {
  name: LocaleName;
  translation: Record<string, string>;
}

const initialState: ILocaleState = {
  name: "en",
  translation: {},
};

export const actAsyncSetLocale = createAsyncThunk<ILocaleState, LocaleName | undefined>(
  "locale/actAsyncSetLocale",
  async (name = initialState.name) => {
    const { default: translation } = await apiGetTranslation(name);
    return { name, translation };
  }
);

const { reducer } = createSlice({
  name: "locale",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(actAsyncSetLocale.fulfilled, (state, { payload }) => {
      state.name = payload.name;
      state.translation = payload.translation;
    });
  },
});

export default reducer;
