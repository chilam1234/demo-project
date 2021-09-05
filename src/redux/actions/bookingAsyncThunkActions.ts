import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import absoluteUrl from "next-absolute-url";

import { commonConfigHeader } from "../../constants";

export const checkBookingThunk = createAsyncThunk<
  any,
  { roomId: string; startDateTime: Date; endDateTime: Date }
>(
  "bookings/check",
  async ({ roomId, startDateTime, endDateTime }, { rejectWithValue }) => {
    try {
      let link = `/api/bookings/check?roomId=${roomId}&startDateTime=${startDateTime}&endDateTime=${endDateTime}`;

      const { data } = await axios.get(link);
      return data.isAvailable;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getBookedDatesThunk = createAsyncThunk<any, string>(
  "bookings/bookedTimes",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/bookings/booked_times?roomId=${id}`
      );
      return data.bookedDates;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const myBookingsThunk = createAsyncThunk<
  any,
  { authCookie: string; req: any }
>("bookings/myBookings", async ({ authCookie, req }, { rejectWithValue }) => {
  try {
    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        cookie: authCookie,
      },
    };

    const { data } = await axios.get(`${origin}/api/bookings/me`, config);
    return data.bookings;
  } catch (error) {
    throw rejectWithValue(error.response.data.message);
  }
});

export const getAllBookingsThunk = createAsyncThunk(
  "bookings/all",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/bookings`);
      return data.bookings;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  "bookings/new",
  async (newBooking, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/bookings`,
        newBooking,
        commonConfigHeader
      );
      return data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteBookingByAdminThunk = createAsyncThunk<any, string>(
  "bookings/deleteByAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/admin/bookings/${id}`);
      return data.success;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteBookingThunk = createAsyncThunk<any, string>(
  "bookings/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/bookings/${id}`);
      return data.success;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getBookingDetails = createAsyncThunk<
  any,
  { authCookie: string; req: any; id: string }
>("bookings/details", async ({ authCookie, req, id }, { rejectWithValue }) => {
  try {
    const { origin } = absoluteUrl(req);

    const config = {
      headers: {
        cookie: authCookie,
      },
    };

    const { data } = await axios.get(`${origin}/api/bookings/${id}`, config);
    return data.booking;
  } catch (error) {
    throw rejectWithValue(error.response.data.message);
  }
});
