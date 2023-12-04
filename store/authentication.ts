import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  registrationModalOpen: boolean;
  loginModalOpen: boolean;
  logoutModalOpen: boolean;
} = {
  registrationModalOpen: false,
  loginModalOpen: false,
  logoutModalOpen: false,
};

export const authenticationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    toggleRegistrationModal: (state, action: PayloadAction<boolean>) => {
      state.registrationModalOpen = action.payload;
    },
    toggleLoginModal: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
    },
    toggleLogoutModal: (state, action: PayloadAction<boolean>) => {
      state.logoutModalOpen = action.payload;
    },
  },
});

export const { toggleRegistrationModal, toggleLoginModal, toggleLogoutModal } =
  authenticationSlice.actions;
