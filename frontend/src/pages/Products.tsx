import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatCurrencyBRL } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchProducts, addProduct, editProduct, removeProduct } from "@/store/productsSlice";
import type { Product } from "@/types/product";

export function Products() {
  const products = useSelector((state: RootState) => state.products.items);
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  async function handleCreate() {
    try {
      await dispatch(addProduct({ code, name, price: Number(price) })).unwrap();

      setCode("");
      setName("");
      setPrice("");
      setDialogOpen(false);

      toast.success("Produto cadastrado com sucesso!");
    } catch {
      toast.error("Erro ao cadastrar produto.");
    }
  }

  function handleOpenEdit(product: Product) {
    setEditingProduct(product);
    setEditCode(product.code);
    setEditName(product.name);
    setEditPrice(String(product.price));
    setEditDialogOpen(true);
  }

  async function handleUpdate() {
    if (!editingProduct) return;
    try {
      await dispatch(editProduct({
        id: editingProduct.id,
        product: { code: editCode, name: editName, price: Number(editPrice) },
      })).unwrap();

      setEditDialogOpen(false);
      setEditingProduct(null);

      toast.success("Produto atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar produto.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await dispatch(removeProduct(id)).unwrap();
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Erro ao excluir produto.");
    }
  }

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Cadastro de Produtos
        </h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Novo Produto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Input
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Preço"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleCreate}
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Código"
              value={editCode}
              onChange={(e) => setEditCode(e.target.value)}
            />
            <Input
              placeholder="Nome"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Input
              placeholder="Preço"
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdate}
            >
              Atualizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{formatCurrencyBRL(Number(product.price))}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500">
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

