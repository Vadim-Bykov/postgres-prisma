import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: (): {
    accountEntryRoute: null | string;
  } => ({
    accountEntryRoute: null,
  }),
  reducers: {
    storeAccountEntryRoute: (state, action: PayloadAction<string>) => {
      state.accountEntryRoute = action.payload;
    },
  },
});

export const { storeAccountEntryRoute } = appSlice.actions;
export const appReducer = appSlice.reducer;
