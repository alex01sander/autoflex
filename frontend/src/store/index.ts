import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import rawMaterialsReducer from "./rawMaterialsSlice";
import productMaterialsReducer from "./productMaterialsSlice";
import productionReducer from "./productionSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productMaterials: productMaterialsReducer,
    production: productionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
