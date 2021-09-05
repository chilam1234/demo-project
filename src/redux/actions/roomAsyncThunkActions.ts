import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import absoluteUrl from "next-absolute-url";

import { commonConfigHeader } from "../../constants";

export const getRoomsThunk = createAsyncThunk<any, any>(
  "rooms/getAll",
  async (
    {
      req,
      currentPage = 1,
      guests,
    }: { req: any; currentPage: number; guests: number },
    { rejectWithValue }
  ) => {
    try {
      const { origin } = absoluteUrl(req);
      let link = `${origin}/api/rooms?page=${currentPage}`;

      if (guests) link = link.concat(`&guestCapacity[gte]=${guests}`);
      const response = await axios.get(link);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getRoomDetailsThunk = createAsyncThunk(
  "rooms/getDetails",
  async ({ req, id }: { req: any; id: string }, { rejectWithValue }) => {
    try {
      const { origin } = absoluteUrl(req);
      let url;
      if (req) {
        url = `${origin}/api/rooms/${id}`;
      } else {
        url = `/api/rooms/${id}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllRoomsByAdminsThunk = createAsyncThunk(
  "rooms/getAllByAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/admin/rooms`);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const newRoomThunk = createAsyncThunk(
  "rooms/new",
  async (roomData: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/rooms",
        { roomData },
        commonConfigHeader
      );
      return data;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);

export const updateRoomThunk = createAsyncThunk<
  any,
  { id: string; roomData: any }
>("rooms/update", async ({ id, roomData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(
      `/api/rooms/${id}`,
      roomData,
      commonConfigHeader
    );
    return data.success;
  } catch (error) {
    throw rejectWithValue(error.response.data.message);
  }
});

export const deleteRoomThunk = createAsyncThunk<any, string>(
  "rooms/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/rooms/${id}`);
      return data.success;
    } catch (error) {
      throw rejectWithValue(error.response.data.message);
    }
  }
);
