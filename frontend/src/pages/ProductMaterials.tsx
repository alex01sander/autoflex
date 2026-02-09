import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchProductMaterials, addProductMaterial, editProductMaterial, removeProductMaterial } from "@/store/productMaterialsSlice";
import { fetchProducts } from "@/store/productsSlice";
import { fetchRawMaterials } from "@/store/rawMaterialsSlice";
import type { ProductMaterial } from "@/types/productMaterial";

export function ProductMaterials() {
  const items = useSelector((state: RootState) => state.productMaterials.items);
  const products = useSelector((state: RootState) => state.products.items);
  const rawMaterials = useSelector((state: RootState) => state.rawMaterials.items);
  const dispatch = useDispatch<AppDispatch>();

  const [productId, setProductId] = useState("");
  const [rawMaterialId, setRawMaterialId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductMaterial | null>(null);
  const [editProductId, setEditProductId] = useState("");
  const [editRawMaterialId, setEditRawMaterialId] = useState("");
  const [editRequiredQuantity, setEditRequiredQuantity] = useState("");

  async function handleCreate() {
    try {
      await dispatch(addProductMaterial({
        productId: Number(productId),
        rawMaterialId: Number(rawMaterialId),
        requiredQuantity: Number(requiredQuantity),
      })).unwrap();
      setProductId("");
      setRawMaterialId("");
      setRequiredQuantity("");
      setDialogOpen(false);
      toast.success("Associação cadastrada com sucesso!");
    } catch {
      toast.error("Erro ao cadastrar associação.");
    }
  }

  function handleOpenEdit(item: ProductMaterial) {
    setEditing(item);
    setEditProductId(String(item.productId));
    setEditRawMaterialId(String(item.rawMaterialId));
    setEditRequiredQuantity(String(item.requiredQuantity));
    setEditDialogOpen(true);
  }

  async function handleUpdate() {
    if (!editing) return;
    try {
      await dispatch(editProductMaterial({
        id: editing.id,
        data: {
          productId: Number(editProductId),
          rawMaterialId: Number(editRawMaterialId),
          requiredQuantity: Number(editRequiredQuantity),
        },
      })).unwrap();
      setEditDialogOpen(false);
      setEditing(null);
      toast.success("Associação atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar associação.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await dispatch(removeProductMaterial(id)).unwrap();
      toast.success("Associação excluída com sucesso!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Erro ao excluir associação.");
    }
  }

  useEffect(() => {
    dispatch(fetchProductMaterials());
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Composição do Produto
        </h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Nova Associação
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Associação</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={rawMaterialId}
                onChange={(e) => setRawMaterialId(e.target.value)}
              >
                <option value="">Selecione uma matéria-prima</option>
                {rawMaterials.map((rm) => (
                  <option key={rm.id} value={rm.id}>{rm.name}</option>
                ))}
              </select>

              <Input
                placeholder="Qtd. Necessária"
                type="number"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
              />

              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Associação</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={editProductId}
              onChange={(e) => setEditProductId(e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={editRawMaterialId}
              onChange={(e) => setEditRawMaterialId(e.target.value)}
            >
              <option value="">Selecione uma matéria-prima</option>
              {rawMaterials.map((rm) => (
                <option key={rm.id} value={rm.id}>{rm.name}</option>
              ))}
            </select>

            <Input
              placeholder="Qtd. Necessária"
              type="number"
              value={editRequiredQuantity}
              onChange={(e) => setEditRequiredQuantity(e.target.value)}
            />

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
              Atualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Matéria-prima</TableHead>
              <TableHead>Qtd. Necessária</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.rawMaterial.name}</TableCell>
                <TableCell>{item.requiredQuantity}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500">
                  Nenhuma associação cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
