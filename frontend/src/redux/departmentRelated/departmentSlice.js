import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  departmentList: [],
  departmentDetails: null,
  loading: false,
  error: null,
  response: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    // Common loading state
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
    },

    // Department List
    getDepartmentListSuccess: (state, action) => {
      state.departmentList = action.payload;
      state.loading = false;
    },

    // Single Department Detail
    getDepartmentDetailSuccess: (state, action) => {
      state.departmentDetails = action.payload;
      state.loading = false;
    },

    // Department Creation or Assignment Success
    departmentActionSuccess: (state, action) => {
      state.response = action.payload;
      state.loading = false;
    },

    // Failed API response
    requestFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset response and error
    resetDepartmentState: (state) => {
      state.response = null;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  getDepartmentListSuccess,
  getDepartmentDetailSuccess,
  departmentActionSuccess,
  requestFailed,
  resetDepartmentState,
} = departmentSlice.actions;

export const departmentReducer = departmentSlice.reducer;
