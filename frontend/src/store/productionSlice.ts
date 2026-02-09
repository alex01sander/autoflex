import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductionSuggestions, getPossibleProductionSuggestions } from "@/services/production";
import type { ProductionSuggestion } from "@/types/production";

export const fetchProduction = createAsyncThunk("production/fetchAll", async () => {
  return await getProductionSuggestions();
});

export const fetchPossibleProduction = createAsyncThunk("production/fetchPossible", async () => {
  return await getPossibleProductionSuggestions();
});

const productionSlice = createSlice({
  name: "production",
  initialState: { 
    items: [] as ProductionSuggestion[], 
    possibleItems: [] as ProductionSuggestion[],
    loading: false 
  },
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
      })
      .addCase(fetchPossibleProduction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPossibleProduction.fulfilled, (state, action) => {
        state.possibleItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchPossibleProduction.rejected, (state) => {
        state.loading = false;
      });
  },
});


export default productionSlice.reducer;
