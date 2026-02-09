// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Products } from "./pages/Products";
import { RawMaterials } from "./pages/RawMaterials";
import { ProductMaterials } from "./pages/ProductMaterials";
import { Production } from "./pages/Production";
import { Toaster } from "./components/ui/sonner";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/product-materials" element={<ProductMaterials />} />
          <Route path="/production" element={<Production />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
