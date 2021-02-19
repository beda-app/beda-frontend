import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Backend, { BackendError } from "../../common/backend/Backend";

export const fetchWeights = createAsyncThunk(
  "dashboard/fetchWeights",
  async (timeDelta, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const token = localStorage.getItem("token");

    try {
      let weights = [];
      let offset = 0;
      let response = await Backend.call("weight/get", {
        ...timeDelta,
        token: token,
      });
      while (response.count !== 0) {
        response = await Backend.call("weight/get", {
          ...timeDelta,
          token: token,
          offset: offset,
          count: 200,
        });
        weights = weights.concat(response.weights);
        offset += 200;
      }
      return weights;
    } catch (e) {
      if (e instanceof BackendError) return rejectWithValue(e.message);
      else return rejectWithValue("Request error");
    }
  }
);

export const addWeight = createAsyncThunk(
  "dashboard/addWeight",
  async (weight, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const requestData = {
      weight,
      token: localStorage.getItem("token"),
    };

    try {
      return await Backend.call("weight/add", requestData);
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
        ...payload.reduce((o, curr) => ({ ...o, [curr.id]: curr }), {}),
      };
      state.error = undefined;
      state.status = "idle";
    },
  },
});

export default dashboardSlice.reducer;
