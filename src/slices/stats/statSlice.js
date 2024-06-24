import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import statService from "./statService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  stats: {
    user: user ? user : null,
    solved: 0,
    attempted: 0,
    fastestSolve: 0,
    slowestSolve: 0,
  },
  // This is for the spinner functionality
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// getUserStats user
export const getUserStats = createAsyncThunk(
  // name of the action could be anything
  "stats/getStats",
  // logic of the action creator
  async (user, thunkAPI) => {
    try {
      return await statService.getStats(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// updateStats user
export const updateStats = createAsyncThunk(
  // name of an action
  "stats/updateStats",
  // logic of the action creator
  async (user, thunkAPI) => {
    try {
      return await statService.updateStats(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const statSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    // This reset is an action that the reducer is performing on the state
    reset: (state) => {
      state.stats = initialState.stats;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // This is to handle the async nature of the asyncThunk function.
    builder
      .addCase(getUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.stats = action.payload;
      })
      .addCase(getUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // This will be the payload that would be set
        state.stats = null;
      })
      .addCase(updateStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(updateStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.stats = null;
      });
  },
});

// Exporting the reducer
export const { reset } = statSlice.actions;
export default statSlice.reducer;
