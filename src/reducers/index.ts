import { configureStore } from "@reduxjs/toolkit";
import confirm from "./confirm";
import content from "./content";
import loading, { actSetLoading } from "./loading";
import { createLoadingMiddleware } from "./middleware/loadingMiddleware";
import notify from "./notify";
import schedule from "./schedule";
import common from "./common";

const loadingMiddleware = createLoadingMiddleware({
  enableLoadingPayload: { type: actSetLoading.type, payload: true },
  disableLoadingPayload: { type: actSetLoading.type, payload: false },
});

export const store = configureStore({
  reducer: {
    loading,
    confirm,
    notify,
    content,
    schedule,
    common,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
