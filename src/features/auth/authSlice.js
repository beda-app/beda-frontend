import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Backend, { BackendError } from "../../common/backend/Backend";

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await Backend.call("auth/login", user);
    return response.token;
  } catch (e) {
    if (e instanceof BackendError) return rejectWithValue(e.message);
    else return rejectWithValue("Request error");
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await Backend.call("auth/register", user);
      return response.token;
    } catch (e) {
      if (e instanceof BackendError) return rejectWithValue(e.message);
      else return rejectWithValue("Request error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    error: undefined,
    status: "idle",
  },
  reducers: {},
  extraReducers: {
    [login.pending]: (state) => {
      state.status = "pending";
    },
    [login.fulfilled]: (state, { payload }) => {
      localStorage.setItem("token", payload);
      state.status = "success";
      state.error = undefined;
    },
    [login.rejected]: (state, action) => {
      state.error = action.payload;
      state.status = "idle";
    },
    [register.pending]: (state) => {
      state.status = "pending";
    },
    [register.fulfilled]: (state, { payload }) => {
      localStorage.setItem("token", payload);
      state.status = "success";
      state.error = undefined;
    },
    [register.rejected]: (state, { payload }) => {
      state.error = payload;
      state.status = "idle";
    },
  },
});

export default authSlice.reducer;
