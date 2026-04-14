import type { AppAction } from "../types";
import * as TYPES from "../types";
import {
  type AsyncState,
  asyncFailure,
  asyncRequest,
  asyncSuccess,
} from "../utils/reducerHelpers";

export interface ContactState extends AsyncState {
  status: "idle" | "submitting" | "success" | "error";
}

const initialState: ContactState = {
  status: "idle",
  isLoading: false,
  error: null,
};

const contactReducer = (
  state = initialState,
  action: AppAction,
): ContactState => {
  switch (action.type) {
    case TYPES.CONTACT_SUBMIT_REQUEST:
      return { ...asyncRequest(state), status: "submitting" };
    case TYPES.CONTACT_SUBMIT_SUCCESS:
      return { ...asyncSuccess(state), status: "success" };
    case TYPES.CONTACT_SUBMIT_FAILURE:
      return {
        ...asyncFailure(state, action.payload as string),
        status: "error",
      };
    case TYPES.CONTACT_RESET_STATUS:
      return initialState;
    default:
      return state;
  }
};

export default contactReducer;
