import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/products";
import type { Product } from "@/types/product";

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  return await getProducts();
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (product: Omit<Product, "id">, { dispatch }) => {
    const created = await createProduct(product);
    dispatch(fetchProducts());
    return created;
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, product }: { id: number; product: Omit<Product, "id"> }, { dispatch }) => {
    const updated = await updateProduct(id, product);
    dispatch(fetchProducts());
    return updated;
  }
);

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await deleteProduct(id);
      dispatch(fetchProducts());
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(axiosError.response?.data?.message || "Erro ao excluir produto.");
      }
      return rejectWithValue("Erro ao excluir produto.");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [] as Product[], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productsSlice.reducer;
