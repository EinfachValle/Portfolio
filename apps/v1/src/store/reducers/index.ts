import { combineReducers } from "redux";

import uiReducer from "./uiReducer";

const rootReducer = combineReducers({
  ui: uiReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;

export default rootReducer;
