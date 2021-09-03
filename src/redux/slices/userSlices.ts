import { createSlice } from "@reduxjs/toolkit";

import {
  deleteUserThunk,
  forgotPasswordThunk,
  getAdminUsersThunk,
  getUserDetailsThunk,
  loadUserThunk,
  registerUserThunk,
  resetPasswordThunk,
  updateUserByIdThunk,
  updateUserThunk,
} from "../actions/userAsyncThunkActions";

export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, success: false, error: null },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
    resetSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUserThunk.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const myUserSlice = createSlice({
  name: "myUser",
  initialState: {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserThunk.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loadUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    });
  },
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
    isDeleted: false,
  },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
    resetMyUpdatedUser(state) {
      state.isUpdated = false;
      state.loading = false;
    },
    resetUpdatedUser(state) {
      state.isUpdated = false;
      state.loading = false;
    },
    resetDeletedUser(state) {
      state.isDeleted = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = action.payload;
    });
    builder.addMatcher(
      (action) =>
        action.type === updateUserThunk.pending.type ||
        action.type === updateUserByIdThunk.pending.type ||
        action.type === deleteUserThunk.pending.type,
      (state) => {
        state.loading = true;
      }
    );

    builder.addMatcher(
      (action) =>
        action.type === updateUserThunk.fulfilled.type ||
        action.type === updateUserByIdThunk.fulfilled.type,
      (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type === updateUserThunk.rejected.type ||
        action.type === updateUserByIdThunk.rejected.type ||
        action.type === deleteUserThunk.rejected.type,
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    message: null,
    success: null,
  },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(forgotPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addCase(resetPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    });
    builder.addMatcher(
      (action) =>
        action.type === forgotPasswordThunk.pending.type ||
        action.type === resetPasswordThunk.pending.type,
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type === forgotPasswordThunk.rejected.type ||
        action.type === resetPasswordThunk.rejected.type,
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const adminAllUsersSlice = createSlice({
  name: "allUsers",
  initialState: { loading: false, users: [], error: null },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminUsersThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAdminUsersThunk.fulfilled, (state, action) => {
      state.loading = false;

      state.users = action.payload;
    });
    builder.addCase(getAdminUsersThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: { loading: false, user: null, error: null },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserDetailsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserDetailsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getUserDetailsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
