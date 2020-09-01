import { configureStore } from "@reduxjs/toolkit";
import content from "./content";
import notify from "./notify";
import schedule from "./schedule";

export const store = configureStore({
  reducer: {
    notify,
    content,
    schedule,
  },
});

export type RootState = ReturnType<typeof store.getState>;
