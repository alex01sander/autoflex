import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchProductMaterials, addProductMaterial, editProductMaterial, removeProductMaterial } from "@/store/productMaterialsSlice";
import { fetchProducts } from "@/store/productsSlice";
import { fetchRawMaterials } from "@/store/rawMaterialsSlice";
import { fetchProduction, fetchPossibleProduction } from "@/store/productionSlice";
import type { ProductMaterial } from "@/types/productMaterial";

export function ProductMaterials() {
  const items = useSelector((state: RootState) => state.productMaterials.items);
  const products = useSelector((state: RootState) => state.products.items);
  const rawMaterials = useSelector((state: RootState) => state.rawMaterials.items);
  const productionItems = useSelector((state: RootState) => state.production.items);
  const dispatch = useDispatch<AppDispatch>();

  // Produto selecionado (Ficha Técnica)
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Dialog para adicionar matéria-prima
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rawMaterialId, setRawMaterialId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState("");

  // Dialog para editar
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductMaterial | null>(null);
  const [editRawMaterialId, setEditRawMaterialId] = useState("");
  const [editRequiredQuantity, setEditRequiredQuantity] = useState("");

  // Matérias-primas filtradas pelo produto selecionado
  const filteredMaterials = useMemo(() => {
    if (!selectedProductId) return [];
    return items.filter((item) => item.productId === Number(selectedProductId));
  }, [items, selectedProductId]);

  // Produto selecionado
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === Number(selectedProductId));
  }, [products, selectedProductId]);

  // Rendimento do produto (da sugestão de produção)
  const productYield = useMemo(() => {
    const production = productionItems.find((p) => p.productId === Number(selectedProductId));
    return production?.maxQuantity || 0;
  }, [productionItems, selectedProductId]);

  // Totalizadores
  const totals = useMemo(() => {
    const precoVenda = selectedProduct?.price || 0;

    return {
      rendimento: productYield,
      precoVenda,
    };
  }, [productYield, selectedProduct]);

  async function handleCreate() {
    if (!selectedProductId) {
      toast.error("Selecione um produto primeiro.");
      return;
    }
    try {
      await dispatch(addProductMaterial({
        productId: Number(selectedProductId),
        rawMaterialId: Number(rawMaterialId),
        requiredQuantity: Number(requiredQuantity),
      })).unwrap();
      setRawMaterialId("");
      setRequiredQuantity("");
      setDialogOpen(false);
      toast.success("Matéria-prima adicionada com sucesso!");
      dispatch(fetchProduction());
      dispatch(fetchPossibleProduction());
    } catch {
      toast.error("Erro ao adicionar matéria-prima.");
    }
  }

  function handleOpenEdit(item: ProductMaterial) {
    setEditing(item);
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
          productId: editing.productId,
          rawMaterialId: Number(editRawMaterialId),
          requiredQuantity: Number(editRequiredQuantity),
        },
      })).unwrap();
      setEditDialogOpen(false);
      setEditing(null);
      toast.success("Matéria-prima atualizada com sucesso!");
      dispatch(fetchProduction());
      dispatch(fetchPossibleProduction());
    } catch {
      toast.error("Erro ao atualizar matéria-prima.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await dispatch(removeProductMaterial(id)).unwrap();
      toast.success("Matéria-prima removida com sucesso!");
      dispatch(fetchProduction());
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Erro ao remover matéria-prima.");
    }
  }

  useEffect(() => {
    dispatch(fetchProductMaterials());
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
    dispatch(fetchProduction());
    dispatch(fetchPossibleProduction());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho com seletor de Ficha Técnica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ficha Técnica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-600">Produto:</label>
            <select
              className="flex-1 max-w-md border rounded-md px-3 py-2 text-sm bg-white"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Matéria-prima */}
      {selectedProductId && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Matéria-prima</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={filteredMaterials.length === 0}
                  onClick={() => {
                    if (filteredMaterials.length > 0) {
                      handleDelete(filteredMaterials[filteredMaterials.length - 1].id);
                    }
                  }}
                >
                  Excluir
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setDialogOpen(true)}
                >
                  Inserir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-28 text-right">Quantidade</TableHead>
                    <TableHead className="w-28 text-right">Estoque</TableHead>
                    <TableHead className="w-32 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((item) => {
                    const material = rawMaterials.find((rm) => rm.id === item.rawMaterialId);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{material?.code || "-"}</TableCell>
                        <TableCell>{item.rawMaterial.name}</TableCell>
                        <TableCell className="text-right">{item.requiredQuantity}</TableCell>
                        <TableCell className="text-right">{material?.stockQuantity || 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredMaterials.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        Nenhuma matéria-prima cadastrada para este produto
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Totalizadores */}
      {selectedProductId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Totalizadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500">Rendimento</p>
                <p className="text-xl font-semibold">{totals.rendimento} un</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500">Preço de Venda</p>
                <p className="text-xl font-semibold">R$ {Number(totals.precoVenda).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para inserir nova matéria-prima */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Matéria-prima</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Matéria-prima</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                value={rawMaterialId}
                onChange={(e) => setRawMaterialId(e.target.value)}
              >
                <option value="">Selecione uma matéria-prima</option>
                {rawMaterials.map((rm) => (
                  <option key={rm.id} value={rm.id}>
                    {rm.code} - {rm.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantidade Necessária</label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1"
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar matéria-prima */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Matéria-prima</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Matéria-prima</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                value={editRawMaterialId}
                onChange={(e) => setEditRawMaterialId(e.target.value)}
              >
                <option value="">Selecione uma matéria-prima</option>
                {rawMaterials.map((rm) => (
                  <option key={rm.id} value={rm.id}>
                    {rm.code} - {rm.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantidade Necessária</label>
              <Input
                type="number"
                placeholder="0"
                className="mt-1"
                value={editRequiredQuantity}
                onChange={(e) => setEditRequiredQuantity(e.target.value)}
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
              Atualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mensagem quando nenhum produto selecionado */}
      {!selectedProductId && (
        <div className="text-center py-12 text-slate-500">
          <p>Selecione um produto acima para visualizar e gerenciar sua ficha técnica.</p>
        </div>
      )}
    </div>
  );
}
