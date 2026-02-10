import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial } from "@/services/rawMaterials";
import type { RawMaterial } from "@/types/rawMaterial";

export const fetchRawMaterials = createAsyncThunk("rawMaterials/fetchAll", async () => {
  return await getRawMaterials();
});

export const addRawMaterial = createAsyncThunk(
  "rawMaterials/add",
  async (material: Omit<RawMaterial, "id">, { dispatch }) => {
    const created = await createRawMaterial(material);
    dispatch(fetchRawMaterials());
    return created;
  }
);

export const editRawMaterial = createAsyncThunk(
  "rawMaterials/edit",
  async ({ id, material }: { id: number; material: Omit<RawMaterial, "id"> }, { dispatch }) => {
    const updated = await updateRawMaterial(id, material);
    dispatch(fetchRawMaterials());
    return updated;
  }
);

export const removeRawMaterial = createAsyncThunk(
  "rawMaterials/remove",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteRawMaterial(id);
      dispatch(fetchRawMaterials());
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosError.response?.data?.message || "Error deleting raw material.");
      }
      return rejectWithValue("Error deleting raw material.");
    }
  }
);

const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState: { items: [] as RawMaterial[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRawMaterials.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default rawMaterialsSlice.reducer;
