import { configureStore } from "@reduxjs/toolkit";
import selectSlice from "./select-slice";

const store = configureStore({
    reducer: {
        select: selectSlice.reducer,
    }
})

export default store;