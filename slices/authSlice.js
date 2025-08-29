import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      const res = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, // DummyJSON expects username
          password,
          expiresInMins: 30,
        }),
      });

      const result = await res.json();
      if (!res.ok) return rejectWithValue(result?.message || "Login failed");

      // Choose storage based on "Remember me"
      const storage = remember ? window.localStorage : window.sessionStorage;

      const auth = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          id: result.id,
          username: result.username,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          image: result.image,
          gender: result.gender,
        },
        expiresAt: Date.now() + 30 * 60 * 1000,
      };

      storage.setItem("auth", JSON.stringify(auth));

      return auth;
    } catch (err) {
      return rejectWithValue("Something went wrong. Try again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.success = false;
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    },
     abc: () => {
      console.log(11);
    
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { logout,abc } = authSlice.actions;
export default authSlice.reducer;
