import { UserDto } from "@/server/dtos/userDto";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userApi } from "./features/api/subApi/userApi";
import { appApi } from "./features/api/appApi";
import { UserLocation } from "@/models/location";

interface UserState {
  userData?: UserDto;
  isAuthorized?: boolean;
  currentLocation?: UserLocation;
}

const initialState: UserState = {
  userData: undefined,
  isAuthorized: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.authentication.matchFulfilled,
      (state, { payload }) => {
        state.isAuthorized = payload.auth;
        state.userData = payload.user;
      }
    );

    builder.addMatcher(
      userApi.endpoints.authentication.matchRejected,
      (state) => {
        state.isAuthorized = false;
      }
    );

    builder.addMatcher(
      userApi.endpoints.createUser.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload;
        state.isAuthorized = true;
      }
    );

    builder.addMatcher(
      userApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.userData = payload;
        state.isAuthorized = true;
      }
    );

    builder.addMatcher(userApi.endpoints.logout.matchFulfilled, (state) => {
      state.userData = undefined;
      state.isAuthorized = false;

      appApi.util.resetApiState();
    });

    builder.addMatcher(
      appApi.endpoints.getLocation.matchFulfilled,
      (state, { payload }) => {
        state.currentLocation = payload;
      }
    );
  },
});

export const { setUserData } = userSlice.actions;

export const userReducer = userSlice.reducer;
