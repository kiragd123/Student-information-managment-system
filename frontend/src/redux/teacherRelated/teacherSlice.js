import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teachersList: [],
    teacherDetails: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        doneSuccess: (state, action) => {
            state.teacherDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getSuccess: (state, action) => {
            state.teachersList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        postDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        resetTeacherState: (state) => {
            state.getresponse = null;
            state.error = null;
            state.statestatus = "idle";
        }

    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    doneSuccess,
    postDone,
    resetTeacherState
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;