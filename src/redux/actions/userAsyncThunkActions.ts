import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { commonConfigHeader } from "../../constants";

export const registerUserThunk = createAsyncThunk<any, any>(
  "users/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/auth/register",
        userData,
        commonConfigHeader
      );
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  "users/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/me");

      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/updateMe",
  async (userData: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        "/api/me/update",
        userData,
        commonConfigHeader
      );
      return data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "users/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/auth/forgot",
        { email },
        commonConfigHeader
      );
      return data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk<
  any,
  { token: string; passwords: { password: string; confirmPassword: string } }
>(
  "users/resetPasswordThunk",
  async ({ token, passwords }, { rejectWithValue }) => {
    const config = commonConfigHeader;
    try {
      const { data } = await axios.put(
        `/api/auth/reset/${token}`,
        passwords,
        config
      );
      return data.success;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getAdminUsersThunk = createAsyncThunk(
  "users/getAdmins",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/users`);
      return data.users;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getUserDetailsThunk = createAsyncThunk(
  "users/geyUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/users/${id}`);
      return data.user;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const updateUserByIdThunk = createAsyncThunk<
  any,
  { id: string; userData: any }
>("users/updateById", async ({ id, userData }, { rejectWithValue }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const { data } = await axios.put(
      `/api/admin/users/${id}`,
      userData,
      config
    );
    return data.success;
  } catch (error) {
    throw rejectWithValue(error.response.data.message);
  }
});

export const deleteUserThunk = createAsyncThunk(
  "users/deleteById",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/admin/users/${id}`);
      return data.success;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);
