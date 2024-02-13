import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { userReducer } from "./userSlice";
import { appApi } from "./features/api/appApi";
import { authenticationSlice } from "./authentication";
import { appReducer } from "./app";

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    authentication: authenticationSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
