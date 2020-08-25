import { configureStore } from "@reduxjs/toolkit";
import content from "./content";
import schedule from "./schedule";

export const store = configureStore({
  reducer: {
    content,
    schedule,
  },
});

export type RootState = ReturnType<typeof store.getState>;
