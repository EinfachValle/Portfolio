import { combineReducers } from "redux";

import contactReducer from "@/store/reducers/contact";
import githubReducer from "@/store/reducers/github";
import uiReducer from "@/store/reducers/ui";

export type { AppAction } from "@/store/types";

const rootReducer = combineReducers({
  ui: uiReducer,
  github: githubReducer,
  contact: contactReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
