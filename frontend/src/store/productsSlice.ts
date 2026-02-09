import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, createProduct } from "@/services/products";
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
