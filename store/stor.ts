
// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import dealReducer from "./reducers/dealSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    deal: dealReducer,
    user:userReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
