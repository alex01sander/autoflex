import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductionSuggestions } from "@/services/production";
import type { ProductionSuggestion } from "@/types/production";

export const fetchProduction = createAsyncThunk("production/fetchAll", async () => {
  return await getProductionSuggestions();
});

const productionSlice = createSlice({
  name: "production",
  initialState: { items: [] as ProductionSuggestion[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduction.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProduction.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productionSlice.reducer;
