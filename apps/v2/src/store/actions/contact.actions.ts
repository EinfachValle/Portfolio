import { API, TIMING } from "@/constants/api";

import type { AppThunk } from "../store";
import * as TYPES from "../types";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  captchaToken: string;
  website: string;
}

export const submitContact =
  (formData: ContactFormData): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    dispatch({ type: TYPES.CONTACT_SUBMIT_REQUEST });

    try {
      const response = await fetch(API.CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      await response.json();
      dispatch({ type: TYPES.CONTACT_SUBMIT_SUCCESS });

      setTimeout(() => {
        dispatch({ type: TYPES.CONTACT_RESET_STATUS });
      }, TIMING.CONTACT_RESET_DELAY);

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: TYPES.CONTACT_SUBMIT_FAILURE, payload: message });
      return false;
    }
  };

export const resetContactStatus = (): AppThunk => (dispatch) => {
  dispatch({ type: TYPES.CONTACT_RESET_STATUS });
};
