import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Backend, { BackendError } from "../../common/backend/Backend";

const fetchWeights = createAsyncThunk(
  "dashboard/fetchWeights",
  async (timeDelta, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const requestData = {
      ...timeDelta,
      token: localStorage.getItem("token"),
    };

    try {
      return await Backend.call("weights/get", requestData);
    } catch (e) {
      if (e instanceof BackendError) return rejectWithValue(e.message);
      else return rejectWithValue("Request error");
    }
  }
);

const addWeight = createAsyncThunk(
  "dashboard/addWeight",
  async (weight, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const requestData = {
      weight: weight,
      token: localStorage.getItem("token"),
    };

    try {
      return await Backend.call("weights/add", requestData);
    } catch (e) {
      if (e instanceof BackendError) return rejectWithValue(e.message);
      else return rejectWithValue("Request error");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    statistics: {},
    error: undefined,
    status: "idle",
  },
  reducers: {},
  extraReducers: {
    [addWeight.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    [addWeight.pending]: (state) => {
      state.status = "pending";
    },
    [addWeight.fulfilled]: (state, { payload }) => {
      state.statistics = {
        ...state.statistics,
        [payload.id]: payload,
      };
      state.error = undefined;
      state.status = "idle";
    },
    [fetchWeights.rejected]: (state, { payload }) => {
      state.error = payload;
    },
    [fetchWeights.pending]: (state) => {
      state.status = "pending";
    },
    [fetchWeights.fulfilled]: (state, { payload }) => {
      state.statistics = {
        ...state.statistics,
        ...payload,
      };
      state.error = undefined;
      state.status = "idle";
    },
  },
});

export default dashboardSlice.reducer;
