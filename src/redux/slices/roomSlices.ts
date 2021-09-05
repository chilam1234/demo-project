import { createSlice } from "@reduxjs/toolkit";

import { getAllRoomsByAdminsThunk, getAllRoomsByAdminsThunk, getRoomDetailsThunk, getRoomsThunk } from "../actions/roomAsyncThunkActions";
import {
  deleteUserThunk,
  forgotPasswordThunk,
  getAdminUsersThunk,
  getUserDetailsThunk,
  loadUserThunk,
  resetPasswordThunk,
  updateUserByIdThunk,
  updateUserThunk,
} from "../actions/userAsyncThunkActions";

export const allRoomsSlice = createSlice({
  name: "allRooms",
  initialState: {
    rooms: [],
    loading: false,
    roomsCount: null,
    filteredRoomsCount: null,
    error: null,
    pageSize: 8,
  },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllRoomsByAdminsThunk.pending, (state) => {
        state.loading = true;
      });
    builder.addCase(getRoomsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.roomsCount = action.payload.roomsCount;
      state.filteredRoomsCount = action.payload.filteredRoomsCount;
      state.pageSize = action.payload.pageSize;
      state.rooms = action.payload.rooms;
    });
    builder.addCase(getAllRoomsByAdminsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.rooms;
      });
    builder.addCase(getRoomsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllRoomsByAdminsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const roomDetailsSlice = createSlice({
  name: "roomDetails",
  initialState: {
    loading: true,
    error: null,
    room: {},
  },
  reducers: {
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomDetailsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRoomDetailsThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.room = action.payload;
    });
    builder.addCase(getRoomDetailsThunk.rejected, (state, action) => {
      state.loading = false;
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
