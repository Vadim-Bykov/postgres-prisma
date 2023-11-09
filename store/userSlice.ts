import { UserDto } from "@/server/dtos/userDto";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { appApi } from "./features/api/appApi";

interface UserState {
  userData?: UserDto;
  isAuthorized: boolean;
}

const initialState: UserState = {
  userData: undefined,
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
    // setIsAuthorized: (
    //   state,
    //   action: PayloadAction<UserState["isAuthorized"]>
    // ) => {
    //   state.isAuthorized = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appApi.endpoints.authentication.matchFulfilled,
      (state, { payload }) => {
        state.isAuthorized = payload.auth;
        state.userData = payload.user;
      }
    );

    builder.addMatcher(
      appApi.endpoints.createUser.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload;
        state.isAuthorized = true;
      }
    );

    builder.addMatcher(
      appApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload;
        state.isAuthorized = true;
      }
    );

    builder.addMatcher(appApi.endpoints.logout.matchFulfilled, (state) => {
      state.userData = undefined;
      state.isAuthorized = false;
    });
  },
});

export const { setUserData } = userSlice.actions;

export const userReducer = userSlice.reducer;
