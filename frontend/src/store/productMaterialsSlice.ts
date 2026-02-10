import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductMaterials, createProductMaterial, updateProductMaterial, deleteProductMaterial } from "@/services/productMaterials";
import type { ProductMaterial } from "@/types/productMaterial";

export const fetchProductMaterials = createAsyncThunk("productMaterials/fetchAll", async () => {
  return await getProductMaterials();
});

export const addProductMaterial = createAsyncThunk(
  "productMaterials/add",
  async (data: { productId: number; rawMaterialId: number; requiredQuantity: number }, { dispatch }) => {
    const created = await createProductMaterial(data);
    dispatch(fetchProductMaterials());
    return created;
  }
);

export const editProductMaterial = createAsyncThunk(
  "productMaterials/edit",
  async ({ id, data }: { id: number; data: { productId: number; rawMaterialId: number; requiredQuantity: number } }, { dispatch }) => {
    const updated = await updateProductMaterial(id, data);
    dispatch(fetchProductMaterials());
    return updated;
  }
);

export const removeProductMaterial = createAsyncThunk(
  "productMaterials/remove",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteProductMaterial(id);
      dispatch(fetchProductMaterials());
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosError.response?.data?.message || "Error deleting association.");
      }
      return rejectWithValue("Error deleting association.");
    }
  }
);

const productMaterialsSlice = createSlice({
  name: "productMaterials",
  initialState: { items: [] as ProductMaterial[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductMaterials.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productMaterialsSlice.reducer;
