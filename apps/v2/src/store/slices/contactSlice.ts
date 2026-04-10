import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  captchaToken: string;
  website: string;
}

interface ContactState {
  status: "idle" | "submitting" | "success" | "error";
  error: string | null;
}

const initialState: ContactState = {
  status: "idle",
  error: null,
};

export const submitContact = createAsyncThunk(
  "contact/submit",
  async (formData: ContactFormData, { dispatch }) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`Failed to submit contact form: ${response.statusText}`);
    }
    const result = await response.json();
    setTimeout(() => {
      dispatch(resetStatus());
    }, 5000);
    return result;
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.status = "submitting";
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { resetStatus } = contactSlice.actions;
export default contactSlice.reducer;
