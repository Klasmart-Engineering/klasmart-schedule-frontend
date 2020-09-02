import { configureStore } from "@reduxjs/toolkit";
import content from "./content";
import loading from "./loading";
import { loadingMiddleware } from "./middleware/loadingMiddleware";
import notify from "./notify";
import schedule from "./schedule";

export const store = configureStore({
  reducer: {
    loading,
    notify,
    content,
    schedule,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
