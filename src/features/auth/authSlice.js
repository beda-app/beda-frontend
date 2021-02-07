import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Backend from "../../common/backend/Backend";

const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await Backend.call("auth/login", user);
    return response.token;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;

  try {
    const response = await Backend.call("auth/register", user);
    return response.token;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    error: undefined,
    status: "idle",
  },
  reducers: {},
  extraReducers: {
    [login.pending]: (state) => (state.status = "pending"),
    [login.fulfilled]: (state, { token }) => {
      localStorage.setItem("token", token);
      state.status = "idle";
    },
    [login.rejected]: (state, { payload }) => {
      state.error = payload;
      state.status = "idle";
    },
    [register.pending]: (state) => (state.status = "pending"),
    [register.fulfilled]: (state, { token }) => {
      localStorage.setItem("token", token);
      state.status = "idle";
    },
    [register.rejected]: (state, { payload }) => {
      state.error = payload;
      state.status = "idle";
    },
  },
});

export default authSlice.reducer;
