import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchProducts, addProduct } from "@/store/productsSlice";

export function Products() {
  const products = useSelector((state: RootState) => state.products.items);
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  R$ {Number(product.price).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-500">
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
