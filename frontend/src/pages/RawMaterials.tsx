import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RootState, AppDispatch } from "@/store";
import { fetchRawMaterials, addRawMaterial, editRawMaterial, removeRawMaterial } from "@/store/rawMaterialsSlice";
import type { RawMaterial } from "@/types/rawMaterial";

export function RawMaterials() {
  const items = useSelector((state: RootState) => state.rawMaterials.items);
  const dispatch = useDispatch<AppDispatch>();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editStockQuantity, setEditStockQuantity] = useState("");

  async function handleCreate() {
    try {
      await dispatch(addRawMaterial({ code, name, stockQuantity: Number(stockQuantity) })).unwrap();
      setCode("");
      setName("");
      setStockQuantity("");
      setDialogOpen(false);
      toast.success("Matéria-prima cadastrada com sucesso!");
    } catch {
      toast.error("Erro ao cadastrar matéria-prima.");
    }
  }

  function handleOpenEdit(item: RawMaterial) {
    setEditing(item);
    setEditCode(item.code);
    setEditName(item.name);
    setEditStockQuantity(String(item.stockQuantity));
    setEditDialogOpen(true);
  }

  async function handleUpdate() {
    if (!editing) return;
    try {
      await dispatch(editRawMaterial({
        id: editing.id,
        material: { code: editCode, name: editName, stockQuantity: Number(editStockQuantity) },
      })).unwrap();
      setEditDialogOpen(false);
      setEditing(null);
      toast.success("Matéria-prima atualizada com sucesso!");
    } catch {
      toast.error("Erro ao atualizar matéria-prima.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await dispatch(removeRawMaterial(id)).unwrap();
      toast.success("Matéria-prima excluída com sucesso!");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Erro ao excluir matéria-prima.");
    }
  }

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">
          Cadastro de Matérias-primas
        </h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Nova Matéria-prima
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Matéria-prima</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input placeholder="Código" value={code} onChange={(e) => setCode(e.target.value)} />
              <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Qtd. Estoque" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
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
            <DialogTitle>Editar Matéria-prima</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input placeholder="Código" value={editCode} onChange={(e) => setEditCode(e.target.value)} />
            <Input placeholder="Nome" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input placeholder="Qtd. Estoque" type="number" value={editStockQuantity} onChange={(e) => setEditStockQuantity(e.target.value)} />
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
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Qtd. Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.stockQuantity}</TableCell>
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
                  Nenhuma matéria-prima cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
