import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBookingApi,
  fetchMyBookingsApi,
  fetchBookingByReferenceApi,
  cancelBookingApi,
} from "../../api/endpoints";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await createBookingApi(bookingData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to create booking" }
      );
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMy",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await fetchMyBookingsApi(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch bookings" }
      );
    }
  }
);

export const fetchBookingByReference = createAsyncThunk(
  "booking/fetchByReference",
  async (bookingReference, { rejectWithValue }) => {
    try {
      const res = await fetchBookingByReferenceApi(bookingReference);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch booking" }
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async ({ bookingReference, reason }, { rejectWithValue }) => {
    try {
      const res = await cancelBookingApi(bookingReference, reason);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to cancel booking" }
      );
    }
  }
);

const initialState = {
  myBookings: [],
  currentBooking: null,
  pagination: { page: 1, limit: 10, totalPages: 1, totalCount: 0 },
  loading: false,
  error: null,
  createSuccess: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    // createBooking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.createSuccess = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Booking failed";
      });

    // fetchMyBookings
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload.bookings || [];
        state.pagination = {
          page: action.payload.page ?? 1,
          limit: action.payload.limit ?? 10,
          totalPages: action.payload.totalPages ?? 1,
          totalCount: action.payload.totalCount ?? 0,
        };
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load bookings";
      });

    // fetchBookingByReference
    builder
      .addCase(fetchBookingByReference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingByReference.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
      })
      .addCase(fetchBookingByReference.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load booking";
      });

    // cancelBooking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update status in myBookings list if present
        const ref = action.payload.bookingReference;
        const idx = state.myBookings.findIndex(
          (b) => b.bookingReference === ref
        );
        if (idx !== -1) state.myBookings[idx].status = "cancelled";
        // Update currentBooking if it matches
        if (state.currentBooking?.bookingReference === ref) {
          state.currentBooking.status = "cancelled";
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to cancel booking";
      });
  },
});

export const { clearBookingError, resetCreateSuccess, clearCurrentBooking } =
  bookingSlice.actions;

export const selectMyBookings = (state) => state.booking.myBookings;
export const selectCurrentBooking = (state) => state.booking.currentBooking;
export const selectBookingPagination = (state) => state.booking.pagination;
export const selectBookingLoading = (state) => state.booking.loading;
export const selectBookingError = (state) => state.booking.error;
export const selectCreateSuccess = (state) => state.booking.createSuccess;

export default bookingSlice.reducer;
