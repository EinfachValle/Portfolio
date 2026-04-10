import { useDispatch, useSelector } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import contactReducer from "./slices/contactSlice";
import githubReducer from "./slices/githubSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    github: githubReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
