import { createSlice } from "@reduxjs/toolkit";

const selectSlice = createSlice({
    name: "select",
    initialState: {
        data:[],
        brushedIndexArr:[],
        brushedData: JSON.stringify([]),
        isLoading: false
    },
    reducers: {
        setBrushedIndexArr(state, action) {
            state.brushedIndexArr = action.payload;
        },
        setBrushedData(state, action) {
            state.brushedData = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        }
    },
});

export const selectActions = selectSlice.actions;

export default selectSlice;