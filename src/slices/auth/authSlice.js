import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isResetSuccessful: false,
  message: "",
};

// Register user
// This is an action creator
export const register = createAsyncThunk(
  // This is an action type. This will trigger the slice with the name auth.
  "auth/register",
  // logic of the action creator
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
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

// Login user
export const login = createAsyncThunk(
  // name of an action
  "auth/login",
  // logic of the action creator
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    
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

export const googleLogin = createAsyncThunk(
  // name of an action
  "auth/googleLogin",
  // logic of the action creator
  async (userEmail, thunkAPI) => {
    try {
      return await authService.googleLogin();
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

export const resetPassword = createAsyncThunk(
  // name of an action
  "auth/resetPassword",
  // logic of the action creator
  async (resetData, thunkAPI) => {
    try {
      return await authService.resetPassword(resetData);
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

export const updateSolvedProblems = createAsyncThunk(
  // name of an action
  "auth/updateSolvedProblems",
  // logic of the action creator
  async (updateData, thunkAPI) => {
    try {
      return await authService.updateSolvedProblems(updateData);
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

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// So slice is a portion of the whole state
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // This reset is an action creator that the reducer is performing on the state
    // We are not resetting the user as we need to persist the userf
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isResetSuccessful = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // This is to handle the async nature of the asyncThunk function.
    // The objects pending, fulfilled and rejected are indeed action objects
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload; // This will be the payload that would be set
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // This action.payload is that data that is returned by authservice.login
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isResetSuccessful = true;
        // We are marking isSuccess false here so that we may not login directly after reseting the password
        // This action.payload is that data that is returned by authservice.login
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isResetSuccessful = false;
        state.message = action.payload;
        console.log(state.message);
        state.user = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isResetSuccessful = true;
        // We are marking isSuccess false here so that we may not login directly after reseting the password
        // This action.payload is that data that is returned by authservice.login
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isResetSuccessful = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateSolvedProblems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSolvedProblems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateSolvedProblems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

// Exporting the reducer
export const { reset } = authSlice.actions;
export default authSlice.reducer;
