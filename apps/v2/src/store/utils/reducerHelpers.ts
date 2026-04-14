export interface AsyncState {
  isLoading: boolean;
  error: string | null;
}

export const asyncRequest = <S extends AsyncState>(state: S): S => ({
  ...state,
  isLoading: true,
  error: null,
});

export const asyncSuccess = <S extends AsyncState>(state: S): S => ({
  ...state,
  isLoading: false,
  error: null,
});

export const asyncFailure = <S extends AsyncState>(
  state: S,
  error: string,
): S => ({
  ...state,
  isLoading: false,
  error,
});
