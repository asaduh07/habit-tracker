import { configureStore } from '@reduxjs/toolkit';
import { habitReducer } from '../features/habit/habitReducer';
export const store = configureStore({
  reducer: {
    habitReducer 
  },   
});
